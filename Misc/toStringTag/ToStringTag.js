/*
 * ----------------------------------------------------------------------
 * File:      ToStringTag.js
 * Project:   toStringTag
 * Author:    Sanjay Vyas
 * 
 * Description:
 *    Use Symbol.toStringTag to tag our user defined classes/functions
 * ----------------------------------------------------------------------
 * Revision History:
 * 2020-Aug-02	[SV]: Created
 * ----------------------------------------------------------------------
 */

// Built in objects have their class name [object Map] in toString()
let map = new Map();
console.log(map.toString());
/* [object Map] */

// User defined functions report [object Object]
function Person() {

}
let person = new Person();
console.log(person.toString());
/* [object Object] */

// We can emulate the built in classes
function Employee() {
}
Employee.prototype[Symbol.toStringTag] = Employee.name;

// This will print [object Employee] instead of [object Object]
let emp = new Employee();
console.log(emp.toString());
/* [object Employee] */

// Let's Make it easier to set tag to any class
const setTag = (fn, name = fn.name) => {
  if (typeof fn == 'function')
    fn.prototype[Symbol.toStringTag] = name;
}

function Manager() {

}

// Now tag any class/function
setTag(Manager)
let mgr = new Manager();
console.log(mgr.toString());
/* [object Manager] */
