/*
 * ----------------------------------------------------------------------
 * File:      PureArray.js
 * Project:   PureArray
 * Author:    Sanjay Vyas
 * 
 * Description:
 *    PureArray reject indexs which are non-negative or non numbers 
 * ----------------------------------------------------------------------
 * Revision History:
 * 2020-Aug-02	[SV]: Created
 * ----------------------------------------------------------------------
 */

// Normal usage
console.log("const normalArray = [11, 23, 35];");
const normalArray = [11, 23, 35];
console.log(normalArray);

// Adding by index
console.log("normalArray[3] = 48;");
normalArray[3] = 48;
console.log(normalArray);

// Non positive index get added as keys
console.log("normalArray[-1]=5");
normalArray[-1] = 5
console.log(normalArray);

// Even string
normalArray['foo'] = 'bar';
console.log("normalArray['foo'] = 'bar';")
console.log(normalArray);

// for of gives only positive index
console.log("for (let index of normalArray)");
for (let element of normalArray)
  console.log(element);

// for in gives ALL key/value pairs
console.log("for (let index in normalArray)");
for (let index in normalArray)
  console.log(`${index}: ${normalArray[index]}`);

// It counts only positive index
console.log("normalArray.length");
console.log(normalArray.length);

// Array proxy
const PureArray = (...args) =>
  new Proxy([...args], // Create internal array

    // Handler with traps
    {
      // What an ugly hack!
      lastLength:0,

      // Intercept assignment to array using index
      set(target, property, value, receiver) {

        if (property == 'length')
          this.lastLength = value;
        
          // Check if its one of the built in properties
        if (Reflect.has(target, property))
          return Reflect.set(target, property, receiver);

        // Check if property is positive integer
        const index = Number.parseInt(property);
        if (Number.isNaN(index) || index < 0)
          throw new Error("Index must be >= 0");

        // Otherwise call the internal array
        Reflect.set(target, property, value, receiver);
      },

      // Intercept access to the array via index
      get(target, property, receiver) {
        // Check if its one of the built in properties
        if (Reflect.has(target, property))
          return Reflect.get(target, property, receiver);

        // Why does jS call toPrimitive for length?
        if (property == Symbol.toPrimitive) {
          return (hint) => this.lastLength;
          
          const index = Number.parseInt(property);
          if (Number.isNaN(index) || index < 0)
            throw new Error("Index must be >= 0");
        }
        // Otherwise call the internal array
        return Reflect.get(target, property, receiver);
      },
    }
  );


// let's create our "Pure" array
const myArray = PureArray(1, 2, 3);
console.log(myArray);

// Normal operations work
myArray[3] = 4;
console.log(myArray);
console.log(myArray.slice(2, 3));
console.log(myArray.length);
myArray.length = 6;
console.log(myArray.length);
console.log(myArray);

// These don't work anymore
myArray[-1] = 5;
console.log(myArray[-3]);
myArray['foo'] = 'bar';
console.log(myArray['foo']);
