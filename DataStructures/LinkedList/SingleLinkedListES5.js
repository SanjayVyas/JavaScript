/*
 * ----------------------------------------------------------------------
 * File:      SingleLinkedList.js
 * Project:   LinkedList
 * Author:    Sanjay Vyas
 * 
 * Description:
 *    Implementation of single linked list ES5 style 
 * ----------------------------------------------------------------------
 * Revision History:
 * 2020-Aug-01	[SV]: Created
 * ----------------------------------------------------------------------
 */

// Node represents a single value in the list
function Node(value) {
  this.prev = null;
  this.value = value;
  this.next = null;
}

// List contains nodes
function List() {
  this.head = null;
  this.tail = null;
  for (var index = 0; index < arguments.length; index++)
    this.pushBack(arguments[index]);
}

// pushBack take varargs
List.prototype.pushBack = function () {
  for (var index = 0; index < arguments.length; index++) {
    var newNode = new Node(arguments[index]);

    // If first time, make it head as well as tail
    if (null == this.head)
      this.head = newNode
    else
      // Subsequent times, add it beyond tail
      this.tail.next = newNode;

    this.tail = newNode;
  }
}

List.prototype.printForward = function () {
  for (var current = this.head; current != null; current = current.next)
    console.log(current.value);
}


let list = new List(1, 2, 3);
list.printForward();
list.pushBack(4, 5, 6);
list.printForward();