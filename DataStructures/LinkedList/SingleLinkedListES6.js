/*
 * ----------------------------------------------------------------------
 * File:      SingleLinkedListEs6.js
 * Project:   LinkedList
 * Author:    Sanjay Vyas
 * 
 * Description:
 *    Implementation of single linked list E6 style
 * ----------------------------------------------------------------------
 * Revision History:
 * 2020-Aug-01	[SV]: Created
 * ----------------------------------------------------------------------
 */

class Node {
  constructor(value) {
    this.prev = null;
    this.value = value;
    this.next = null;
  }
}

class List {
  constructor(...args) {
    this.head = null;
    this.tail = null;

    this.pushBack(...args);
  }

  pushBack(...args) {
    for (let value of args) {
      let newNode = new Node(value);
    
      if (null == this.head)
        this.head = newNode;
      else
        this.tail.next = newNode;
      
      this.tail = newNode;;
    }
  }

  printForward() {
    for (let current = this.head; current != null; current = current.next) {
      console.log(current.value);
    }
  }
}

let list = new List(1, 2, 3);
list.printForward();
list.pushBack(4, 5, 6);
list.printForward();