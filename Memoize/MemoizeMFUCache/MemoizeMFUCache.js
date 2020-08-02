/*
 * ----------------------------------------------------------------------
 * File:      MemoizeMFUCache.js
 * Project:   MemoizeMFUCache
 * Author:    Sanjay Vyas
 * 
 * Description:
 *    Most Frequently Used cache for Memoize
 * ----------------------------------------------------------------------
 * Revision History:
 * 2020-Aug-02	[SV]: Created
 * ----------------------------------------------------------------------
 */

/**
 * Some debug helpers
 */
const nop = () => { };
let debug = nop;      // Disable debug output
debug = console.log;  // Enable debug output

// Class to store frequency and recency of the key
class Frequency {

  // Private fields
  #frequency;   // Number of times the key has been accessed
  #recency;     // Last timestamp of access

  constructor(frequency = 1, recency = new Date()) {
    this.#frequency = frequency;
    this.#recency = recency.getTime() + recency.getMilliseconds();
  }

  // Update frequency and recency 
  update = () => {
    this.#frequency++;

    let now = new Date();
    this.#recency = now.getTime() + now.getMilliseconds();
  }

  get frequency() { return this.#frequency; }
  get recency() { return this.#recency; }

  toString = () => {
    return `{ frequency: ${this.#frequency}, recency: ${this.#recency} }`;
  }
}

/**
 * MFU class
 */

// We extend the map instead of composing it
// So that non-overridden functions are passed to the base
class MFUMap extends Map {

  #frequencyMap = new Map();
  #maxSize = 10;

  constructor(size = 10) {
    super();
    this.#maxSize = size;
    debug(`Initialized map with size=${size}`);
  }

  // Check and trim our cache size
  #resizeMap = () => {
    if (this.size <= this.#maxSize)
      return false;

    debug(`Resizing map: ${this.size} > ${this.#maxSize}`);

    // Elements required to determine candidates
    let minKey;
    let minFrequency = Number.MAX_VALUE;
    let minTime;

    // Find the lowest frequency key
    for (let [key, value] of this.#frequencyMap) {
      let entryFrequency = value.frequency;
      let entryTime = value.recency;

      // Find the lowest frequency key
      if (entryFrequency < minFrequency) {
        minFrequency = entryFrequency;
        minKey = key;
        minTime = entryTime;
      } else {
        // If there are multiple keys with same frequency
        // Choose the least recency key
        if (entryFrequency == minFrequency) {
          if (entryTime < minTime) {
            minFrequency = entryFrequency;
            minKey = key;
            minTime = entryTime;
          }
        }
      }
    }

    debug(`Deleting { ${minKey} => { frequency: ${minFrequency}, recency: ${minTime} }`);
    this.delete(minKey);
    return true;
  }

  // if key was accessed, increment its frequency
  #updateFrequency = key => {
    let frequencyObject = this.#frequencyMap.get(key);

    // if existing key, update the frequency 
    if (frequencyObject)
      frequencyObject.update();
    else
      this.#frequencyMap.set(key, frequencyObject = new Frequency());

    debug(`Updated { ${key} => ${frequencyObject} }`);

    // Maybe we went over the maxSize, truncate the Map
    this.#resizeMap();
  }

  set(key, value) {
    let result = super.set(key, value);

    // Update the frequency of the key
    this.#updateFrequency(key);

    return result;
  }

  get(key) {
    let exists = super.get(key);

    // Don't update non existing gets
    if (exists)
      this.#updateFrequency(key);

    return exists;
  }
}

// Check if given number is prime
const isPrime = number => {

  if (number < 2) return false;
  // Divide number by all numbers from 2 to sqrt(number)
  // If divisible, then its not a prime
  let div;
  for (div = 2; div <= Math.sqrt(number); div++)
    if (number % div == 0)
      return false;

  return true;
}

// Memoize is a Proxy to the actual function
const memoize = (fn, mfu = 10) => new Proxy(fn,

  // Handler with traps
  {
    cache: new MFUMap(mfu),
    max: mfu,   // Our cache limit

    // Our "magic" property
    get(object, property, receiver) {
      if (property == "cache")
        return this.cache;

      return Reflect.get(object, property, receiver);
    },

    // Intercept call to the wrapped function
    apply(target, thisArg, args) {

      let result = this.cache.get(args.toString());

      if (result)
        return result;

      result = Reflect.apply(target, thisArg, args);
      this.cache.set(args.toString(), result);

      return result;
    }
  }
);

let number = 10;

// Memoize and set the MFU limit to 3
let smartPrime = memoize(isPrime, mfu = 3);

smartPrime(1);
smartPrime(2);

// 1 and 2 are used twice
smartPrime(2);
smartPrime(1);

// 3 is used one
smartPrime(3);

// 4 will cause MFU to drop an entry... which one?
smartPrime(4);

// 3 will get dropped!
// Even though 3 is the most recently used, 1 and 2 have more frequency
console.log(smartPrime.cache);

/*

Updated { 1 => { frequency: 1, recency: 1596387861706 } }
Updated { 2 => { frequency: 1, recency: 1596387861708 } }
Updated { 2 => { frequency: 2, recency: 1596387861708 } }
Updated { 1 => { frequency: 2, recency: 1596387861708 } }
Updated { 3 => { frequency: 1, recency: 1596387861708 } }
Updated { 4 => { frequency: 1, recency: 1596387861708 } }
Resizing map: 4 > 3
Deleting { 3 => { frequency: 1, recency: 1596387861708 }
MFUMap(3) [Map] { '1' => false, '2' => true, '4' => false }

*/