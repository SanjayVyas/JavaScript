/*
 * ----------------------------------------------------------------------
 * File:      Type.js
 * Project:   Misc
 * Author:    Sanjay Vyas
 * 
 * Description:
 *  Alternative to typeof, with more accuracy in type
 * ----------------------------------------------------------------------
 * Revision History:
 * 2020-Aug-03	[SV]: Created
 * ----------------------------------------------------------------------
 */
const type = object =>
  [null, undefined].includes(object)
    ? object
    : Object.getPrototypeOf(object).constructor;

const typeName = object =>
  [null, undefined].includes(object)
    ? String(object)
    : Object.getPrototypeOf(object).constructor.name;


// null and undefined
console.log(type(null));                      // null
console.log(type(undefined));                 // undefined 

// Native types
console.log(type(true) == Boolean);           // true
console.log(type(1) == Number);               // true
console.log(type("JS") == String);            // true
console.log(type(new Number(1)) == Number);   // true
console.log(type(123n) == BigInt);            // true

// Arrays ond objects
let array = [1, 2, 3];
console.log(type(array) == Array);            // true
console.log(typeName(array));                 // Array

// Object literals
let person = { id: 1, name: "Eich" };
console.log(type(person) == Object);          // true
console.log(typeName(person));                // Object

// Function
function Employee() { }
console.log(type(Employee) == Function);      // true
let emp = new Employee();
console.log(type(emp) == Employee);           // true
console.log(typeName(emp));                   // Employee 

// class
class Manager { }
console.log(type(Manager) == Function);       // true
let mgr = new Manager();
console.log(type(mgr) == Manager);            // true
console.log(typeName(mgr));                   // manager

// Built in types
console.log(type(Map) == Function);           // true
let map = new Map();
console.log(type(map) == Map);                // true
console.log(typeName(map));                   // Map



