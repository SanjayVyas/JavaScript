/*
 * ----------------------------------------------------------------------
 * File:      Inspector.js
 * Project:   toStringTag
 * Author:    Sanjay Vyas
 * 
 * Description:
 *   Proxy to trace property usage 
 * ----------------------------------------------------------------------
 * Revision History:
 * 2020-Aug-02	[SV]: Created
 * ----------------------------------------------------------------------
 */

class Inspector {
  // Proxy handlers
  #handler = {
    propertyMap: new Map(),

    // Update frequency of property usage
    updateFrequency(property, which) {

      if (property == 'handler')
        return;

      // Check if property exists in map
      let key = this.propertyMap.get(property);

      // If it does, update usage, else create it
      if (key)
        which == "set"
          ? key.set++
          : key.get++;
      else
        which == "set"
          ? this.propertyMap.set(property, { get: 0, set: 1 })
          : this.propertyMap.set(property, { get: 1, set: 0 })

    },

    // Trap property get/set
    get(target, property) {

      // "Magic" property to report usage
      if (property == "frequency") {
        return this.frequency;
      }

      let result = Reflect.get(target, property);
      result && this.updateFrequency(property, "get");
      return result;
    },

    set(target, property, value) {
      let result = Reflect.set(target, property, value);
      this.updateFrequency(property, "set");
      return result;
    },

    // Report frequency usage
    frequency(property) {

      function toSource(object) {
        let output = "{ ";
        for (property in object)
          output += `${property}: ${object[property]}` + ", ";
        return output.slice(0, output.length - 2) + " }";

      }

      if (property)
        return this.handler.propertyMap.get(property);

      let output = "{\n";
      for (let [key, value] of this.handler.propertyMap)
        output += `  ${key} => ${toSource(value)}\n`;
      return output + "}";
    }

  }

  constructor(object) {
    let proxy = new Proxy(object, this.#handler);
    proxy.handler = this.#handler;
    return proxy;
  }
}

class Employee {

  // Define properties
  id 
  name 

  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  // getters/setters
  get id() { return this.id; }
  set id(value) { this.id = value; }

  get name() { return this.name; }
  set name(value) { return this.name = value; }
}

let eich = new Inspector(new Employee(1, "Eich"));

// Access id thru getters/setters
let count = 1000;
while (--count)
  eich.id++;
console.log(eich.id)

while (count++ < 1000)
  eich.id--;
console.log(eich.id)

// set name a few times
eich.name = "Brendan";
eich.name = "Eich";
eich.name = "Brendan Eich";
eich.name = "Eich, Brendan";
console.log(eich.name);

// Now ask the inspector to report frequency
console.log(eich.frequency());
