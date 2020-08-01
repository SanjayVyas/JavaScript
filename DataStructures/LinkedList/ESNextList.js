/*
 * ----------------------------------------------------------------------
 * File:      ESNextList.js
 * Project:   LinkedList
 * Author:    Sanjay Vyas
 * 
 * Description:
 *    Using latest JavaScript standards to write Sentinel List
 * ----------------------------------------------------------------------
 * Revision History:
 * 2020-Aug-01	[SV]: Created
 * ----------------------------------------------------------------------
 */
const notIndex = (index) => typeof (index) != 'number' || index < 0;

class SentinelList {
  // Define private fields
  #head
  #tail
  #length

  // Define private methods
  #makeNode(value) {
    return { prev: null, value: value, next: null };
  }

  constructor(...args) {

    // Sentinel nodes
    this.#head = this.#makeNode(null);
    this.#tail = this.#makeNode(null);
    this.#length = 0;

    // Empty list -> head and tail point to each other
    this.#head.next = this.#tail;
    this.#tail.prev = this.#head;

    this.pushBack(...args);
  }

  // Standard operations
  pushBack(...args) {

    // Go thru ever arg and add it
    args.forEach(value => {
      let newNode = this.#makeNode(value);

      newNode.prev = this.#tail.prev;
      newNode.next = this.#tail;
      newNode.next.prev = newNode.prev.next = newNode;
      this.#length++;
    });
    // Fluent interface
    return this;
  }

  // Add values to the front
  pushFront(...args) {
    for (let index = args.length - 1; index >= 0; index--) {
      let newNode = this.#makeNode(args[index]);

      newNode.prev = this.#head;
      newNode.next = this.#head.next;
      newNode.prev.next = newNode.next.prev = newNode;
      this.#length++;
    };

    return this;
  }

  // Remove last value
  popBack() {

    // There are no elements
    if (this.#head.next == this.#tail)
      return undefined;

    let value = this.#tail.prev.value;
    this.#tail.prev = this.#tail.prev.prev;
    this.#length--;
    return value;
  }

  // Remove first value
  popFront() {

    // There are no elements
    if (this.#head.next == this.#tail)
      return undefined;

    let value = this.#head.next.value;
    this.#head.next = this.#head.next.next;
    this.#length--;
    return value;

  }

  // Remove a set of values from the list
  remove(...args) {
    let removedNodes = [];
    for (let current = this.#head.next; // head is dummy, skip it
      current != this.#tail;            // tail is dummy, don't go past it
      current = current.next) {

      // Is current node in args?
      if (args.includes(current.value)) {
        let node = current;
        removedNodes.push(current.value);
        current = current.next;
        node.prev.next = node.next;
        node.next.prev = node.prev;
        this.#length--;
      }
    }

    return removedNodes;
  }

  removeFromTo(startIndex, endIndex) {
    if (notIndex(startIndex) || notIndex(endIndex))
      throw new Error("Index must be >=0");

    if (startIndex > endIndex)
      throw new Error("End index must be >= Start Index");

    let index = 0;

    // First locate the start index
    for (let start = this.#head.next;
      start != this.#tail;
      start = start.next) {

      // If we have reached the start Index
      if (index == startIndex) {

        // Now locate the end index
        for (let end = start;
          end != this.#tail;
          end = end.next) {

          // We have found start and end
          if (index == endIndex) {
            // Disconnect nodes from start to end
            start.prev.next = end.next;
            end.next.prev = start.prev;

            this.#length -= end - start + 1;
            return end - start + 1;
          } else {
            index++;
          }
        }
      }
      else {
        index++;
      }
    }
    return 0;
  }

  // Remove values by index 
  removeByIndex(...args) {

    // Empty list
    if (this.#head.next == this.#tail)
      return removedNodes;

    // Array containing the removedNodes will be returned
    let removedNodes = [];
    let removeList;

    // Confirm all args are positive numbers
    args.forEach(index => {
      if (notIndex(index))
        throw new Error("Index must be >=0");
    });

    // Create a sorted array of index
    removeList = args;
    removeList.sort();

    // We will keep track of node and its index
    let listIndex = this.#length - 1;
    let current = this.#tail.prev;

    // Start from the last index, otherwise removal will change the index
    for (let index = removeList.length - 1; index >= 0; index--) {

      // Locate the index in our list
      while (listIndex != removeList[index]) {
        listIndex--;
        current = current.prev;
      }

      // Add to the nodes removed
      removedNodes.push(current.value)

      // Remove the node
      let node = current;
      current = current.prev;
      listIndex--;
      node.prev.next = node.next;
      node.next.prev = node.prev;
    }
    return removedNodes;
  }

  // Convert to array and return
  toArray() {
    let array = [];
    for (let current = this.#head.next;
      current != this.this.#tail;
      current = current.next) {
      array.push(current.value);
    }

    return array;
  }

  // Clear all the nodes from the list
  clear() {

    // Just reset our Sentinel list
    this.#head.next = this.#tail;
    this.#tail.prev = this.#head;
  }

  // Implement our iterator to yield each value
  *[Symbol.iterator]() {
    for (let current = this.#head.next;
      current != this.#tail;
      current = current.next) {
      yield current.value;
    }
  }

  #insertAfterNode(current, ...args) {
    args.forEach(elem => {
      let newNode = new Node(elem);

      // Insert after current
      newNode.prev = current;
      newNode.next = current.next;
      newNode.prev.next = newNode.next.prev = newNode;

      // Keep adding
      current = current.next;
    });
  }

  // Insert operation
  insertAfter(value, ...arg) {

    // Go thru the list
    for (let current = this.#head.next;
      current != this.#tail;
      current = current.next) {

      // Have we found the value?
      if (current.value == value) {
        this.#insertAfterNode(current, ...args);
        return true;
      }
    }
    return false;
  }

  insertBefore(value, ...args) {
    for (let current = this.#head.next;
      current != this.#tail;
      current = current.next) {
      if (current.value == value) {
        this.#insertAfterNode(current.prev, ...args);
        return true;
      }
      return false;
    }
  }

  // forEach will call the callback with each value
  forEach(callback) {
    let index = 0;
    for (let current = this.#head.next;
      current != this.#tail;
      current = current.next) {
      callback(current.value, index++);
    }
  }

  get length() { return this.#length; }
}

let printForward = list => list.forEach(value => console.log(value));

let list = new SentinelList(11, 12, 13);
console.log("forEach");
list.forEach(value => console.log(value));

console.log("Iterator");
for (let value of list)
  console.log(value);

console.log("pushback");
list.pushBack(14, 15, 16);
printForward(list);

console.log("oushfront")
list.pushFront(8, 9, 10);
printForward(list);

console.log("remove");
list.remove(8, 11);
printForward(list);

console.log("removeByIndex");
list.removeByIndex(0, 2);
printForward(list);

console.log("remove from to");
list.removeFromTo(1, 2);
printForward(list);

