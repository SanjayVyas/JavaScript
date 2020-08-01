/*
 * ----------------------------------------------------------------------
 * File:      SentinelList.js
 * Project:   LinkedList
 * Author:    Sanjay Vyas
 * 
 * Description:
 *    Sentinel list have dummy head and tail to reduce operations 
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

// Sentinel List head and tail are dummy
class SentinelList {
  constructor(...args) {

    // Creat head and tail as sentinel nodes
    this.head = new Node(null);   // The nodes can have null as value
    this.tail = new Node(null);   // as these values will not be used

    // Initially they will point to each other (empty list)
    this.head.next = this.tail;
    this.tail.prev = this.head;

    // Add initial set of values 
    this.pushBack(...args);
  }

  // Variable argument method
  pushBack(...args) {
    for (let value of args) {
      let newNode = new Node(value);

      // There is ALWAYS a tail node, so add it before it
      newNode.prev = this.tail.prev;
      newNode.next = this.tail;
      newNode.prev.next = newNode.next.prev = newNode;
    }
  }

  printForward() {
    for (let current = this.head.next;  // head is dummy, start with its next
      current != this.tail;              // Don't goto tail, it's a dummy node
      current = current.next) {
      console.log(current.value);
    }
  }

  remove(...args) {

    // Go thru all the nodes and search for value
    for (let current = this.head.next;  // head is dummy, start with its next
      current != this.tail;              // Don't goto tail, it's a dummy node
      current = current.next) {
      
      // Check if any of the args matches
      if (args.includes(current.value)) {

        // This is where Sentinel list shines
        // We do not have to check for any edge conditions
        // A node will ALWAYS be between two nodes
        // Even if there is a single node, it will have head and tail around


        // Found the value, lets disconnect the node
        current.prev.next = current.next;
        current.next.prev = current.prev;
      }
    }
  }
}

let list = new SentinelList(1, 2, 3);
list.printForward();
list.remove(1, 2);
list.printForward();
