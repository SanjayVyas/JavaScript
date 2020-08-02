/*
 * ----------------------------------------------------------------------
 * File:      Auto.js
 * Project:   AutoVivification
 * Author:    Sanjay Vyas
 * 
 * Description:
 *    Autovivification is a technique which allows us to assign 
 *    properties at a nested level, without first creating the upper
 *    levels 
 * ----------------------------------------------------------------------
 * Revision History:
 * 2020-Aug-03	[SV]: Created
 * ----------------------------------------------------------------------
 */

// If elements is non 0, it creates an array of objects
// otherwise creates a single object
const Auto = elements => {

  if (elements != undefined && elements > 0)
    return new Proxy(new Array(elements),
      {
        get(target, property, receiver) {

          if (property >= target.length)
            return undefined;

          if (!Reflect.has(target, property))
            Reflect.set(target, property, Auto());

          return Reflect.get(target, property, receiver);
        }
      }
    )

  return new Proxy({},
    {
      // Handler checks if prop does not exists, creates it
      get(target, property, receiver) {
       
        if (!Reflect.has(target, property))
          Reflect.set(target, property, Auto());
        return Reflect.get(target, property);
      }
    }
  )
}

// Create an AutoVivification object
let univ = Auto();

// We can assign to any depth without creating the structure
univ.college.stream.year = "A+";

// We can even create array
univ.college.stream.subjects = Auto(3);

// Now assign properties below the array
univ.college.stream.subjects[0].name = "JavaScript";
univ.college.stream.subjects[0].marks = 33;

// Printing the AutoVivification
console.log(univ);
console.log(univ.college.stream.subjects);

