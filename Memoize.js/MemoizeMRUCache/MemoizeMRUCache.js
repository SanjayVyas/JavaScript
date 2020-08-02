/*
 * ----------------------------------------------------------------------
 * File:      MemoizeMRUCache.js
 * Project:   MemoizeMRUCache
 * Author:    Sanjay Vyas
 * 
 * Description:
 *    Memoize using Proxy object and MRU Cache 
 * ----------------------------------------------------------------------
 * Revision History:
 * 2020-Aug-02	[SV]: Created
 * ----------------------------------------------------------------------
 */

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
const memoize = (fn, mru = 10) => new Proxy(fn,

  // Handler with traps
  {
    // Instead of a Map, let's use a list which contains
    // [ {args:2, result:true, args:3, result:3, args:4, result:4} ]
    cache: [],
    max: mru,   // Our cache limit

    // Our "magic" property
    get(object, property, receiver) {
      if (property == "cache")
        return this.cache;

      // Always use Reflect inside property
      return Reflect.get(object, property, receiver);
    },

    // Intercept call to the wrapped function
    apply(target, thisArg, args) {
      
      // Compose the key from args
      let key = args.toString();

      // Scan the list to see if we have args cached
      let exists = this.cache.find(element => {
        element.args == key;
      });

      // If exists, return the result
      if (exists) {
        result = exists.result;
      } else {
        // New result, store it at the end
        result = Reflect.apply(target, thisArg, args);
        this.cache.push({ args: key, result: result });
      }

      // Have we exceeded the limit? Drop the first element
      if (this.cache.length > this.max)
        this.cache.shift();

      return result;
    }
  }
);

// This is a known prime
let smartPrime = memoize(isPrime);
let max = 1000000;
let primeCount = 0;
for (let number = 2; number <= max; number++)
  if (smartPrime(number)) {
    primeCount++;
  }

console.log(`Number of primes between 0 and ${max}: ${primeCount}`);
console.log(`Cache size: ${smartPrime.cache.length}`);

// Let's test 2 again
console.log("2 is prime", smartPrime(2));
console.log('Cache:', smartPrime.cache);
