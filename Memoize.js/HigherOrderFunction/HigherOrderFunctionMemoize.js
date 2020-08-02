/*
 * ----------------------------------------------------------------------
 * File:      HigherOrderFunctionMemoize.js
 * Project:   HigherOrderFunction
 * Author:    Sanjay Vyas
 * 
 * Description:
 *    Implement memoize using higher order function 
 * ----------------------------------------------------------------------
 * Revision History:
 * 2020-Aug-02	[SV]: Created
 * ----------------------------------------------------------------------
 */

// Debug helpers
const nop = () => { };    // To disable, set debug=nop
let debug = console.log;

// Check if given number is prime
const isPrime = number => {

  // Divide number by all numbers from 2 to sqrt(number)
  // If divisible, then its not a prime
  let div;
  for (div = 2; div <= Math.sqrt(number); div++)
    if (number % div == 0) {
      console.log(`Looped ${div} times`);
      return false;
    }
  console.log(`Looped ${div} times`);
  return true;
}

const memoize = fn => {
  // We store previous results here
  // args -> result
  const resultCache = new Map();

  // Return a function to be called
  return memoizer = (...args) => {
    let key = args.toString();

    // If result not in cache, first cache it
    if (!resultCache.has(key))
      resultCache.set(key, fn(...args));

    // Now return it
    return resultCache.get(key);
  }
}

// This is a known prime
let number = 1299827;

// Use higher order function 
const smartPrime = memoize(isPrime);

// Computes the result the first time
console.log(`${number} is prime: ${smartPrime(number)}`);
/*
Looped 1141 times
1299827 is prime: true
*/

// Returns cached result
console.log(`${number} is prime: ${smartPrime(number)}`);
/*
1299827 is prime: true
*/