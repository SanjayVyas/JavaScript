/*
 * ----------------------------------------------------------------------
 * File:      SizeOf.js
 * Project:   SIzeOf
 * Author:    Sanjay Vyas
 * 
 * Description:
 *    An approximate sizeof() for JS objects
 *    Makes assumption on internal sizes
 *    Handles circular references
 *    Cannot handle WeakSet and WeakMap
 *    Currently does not have typed array and buffers support
 *    Still figuring out about Promise and other objects
 * ----------------------------------------------------------------------
 * Revision History:
 * 2020-Aug-07	[SV]: Created
 * ----------------------------------------------------------------------
 */
class SizeOf {

  // Object to be sized
  #object = null;

  // List of native types which dont have to be checked for circular references
  static #nativeList = [
    'null',
    'undefined',
    'Boolean',
    'Number',
    'String',
    'Symbol',
    'BigInt',
  ];

  // Pluggable sizer functions
  #sizeMap = new Map([
    ['null', () => 4],
    ['undefined', () => 0],
    ['Boolean', () => 4],
    ['Number', () => 8],
    ['String', value => value.length * 2],
    ['BigInt', value => value.toString().length],
    ['Date', () => 4],
    ['Symbol', value => this.#symbolSize(value)],
    ['Array', (value, refs) => this.#arraySize(value, refs)],
    ['Function', (value, refs) => this.#functionSize(value, refs)],
    ['Object', (value, refs) => this.#objectSize(value, refs)],
    ['Set', (value, refs) => this.#setSize(value, refs)],
    ['Map', (value, refs) => this.#mapSize(value, refs)],
    ['WeakSet', value => 4],  // These two are the biggest "blackboxes" in JS
    ['WeakMap', value => 4],  // They offer no .size(), .length(), .entires(), .key(), .values() 
  ]);

  // Check if object is native or ref and check for circular references
  #safeSizeOf(object, refs) {
    if (this.isNativeType(object))
      return this.#sizeOf(object);

    if (refs.has(object))
      return 4;

    refs.set(object);
    return this.#sizeOf(object, refs);
  }

  /*
    Bunch of sizers for specific types
    Symbol, Array, Function, Map, Set ...
  */
  #symbolSize(symbol) {
    let isNamed = symbol.toString().match(/Symbol\(([a-zA-Z]+)\)/);
    return isNamed && isNamed[1] != 'undefined' ? isNamed[1].length : 0;
  }

  #functionSize(func) {
    let byteCount = this.#sizeOf(func.name);
    let code = func.toString();
    if (code.includes('[native code]'))
      return byteCount;
    byteCount += code.length;
    return byteCount;
  }

  #objectSize = (object, refs) => {

    // Go thru all the properties and symbols
    let byteCount = 0;
    let propertyCount = 0;
    Object.getOwnPropertyNames(object).forEach(property => {
      propertyCount++;
      byteCount += this.#safeSizeOf(property, refs) + this.#safeSizeOf(object[property], refs);
    });

    Object.getOwnPropertySymbols(object).forEach(symbol => {
      propertyCount++;
      byteCount += this.#symbolSize(symbol);
    });

    // Each property has property descriptor 
    // 4 references = 4 * 4 bytes
    return byteCount + 16;
  }

  #arraySize(array, refs) {
    let byteCount = 0;
    for (let element in array)
      byteCount += this.#safeSizeOf(element, refs) + this.#safeSizeOf(array[element], refs);

    return byteCount;
  }

  #setSize = (set, refs) => {
    let byteCount = 0;
    set.forEach(element => {
      byteCount += this.#safeSizeOf(element);
    });

    return byteCount;
  }

  #mapSize = (map, ref) => {
    let byteCount = 0;
    for (let [key, value] of map) {
      byteCount += this.#safeSizeOf(key) + this.#safeSizeOf(value);
    }
    return byteCount;
  }

  // Run thru the object graph
  #sizeOf(object, refs) {

    // If we have specific sizer function, run it
    let type = this.objectType(object);
    let sizer = this.#sizeMap.get(type);

    // Found a specific sizer for this type
    if (sizer)
      return sizer(object, refs);

    // Or else run the generic objectSize function
    return this.objectSize(object, refs);
  }

  constructor(object) {
    this.#object = object;
  }

  // Give accurate type of object
  objectType(object) {
    return [null, undefined].includes(object)
      ? String(object)
      : object.constructor.name;
  }

  // Check if it is native type
  isNativeType(object) {
    return SizeOf.#nativeList.includes(this.objectType(object));
  }

  // main method for sizing
  sizeOf(object) {
    let refs = new WeakMap();
    return this.#sizeOf(this.#object, refs);
  }

}

const sizeof = object => {
  return new SizeOf(object).sizeOf();
}

