/*
 * ----------------------------------------------------------------------
 * File:      MemoizeNoCacheLimit.js
 * Project:   MemoizeNoCacheLimit
 * Author:    Sanjay Vyas
 * 
 * Description:
 *    Memoize using Proxy, without cache limit 
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
const memoize = fn => new Proxy(fn,

  // Handler with traps
  {
    // We store previous results here
    resultCache: new Map(),

    get(object, property, receiver) {

      // Magic property in Proxy
      if (property == "cache")
        return this.resultCache;
    },

    // Intercept call to the wrapped function
    apply(target, thisArg, args) {

      // Compose our key from args
      let key = args.toString();

      if (!(this.resultCache.has(key)))
        this.resultCache.set(key, Reflect.apply(target, thisArg, args));
      return this.resultCache.get(key);
    }
  }
);

let smartPrime = memoize(isPrime);

// Find out how many primes up to given max
let max = 1000000;
let primeCount = 0;
for (let number = 2; number <= max; number++)
  smartPrime(number) && primeCount++;

console.log(`Number of primes between 0 and ${max}: ${primeCount}`);

// Oh My Ritchie! ENTIRE result is in cache!!
console.log(`Cache memory: ${smartPrime.cache.size}`);
