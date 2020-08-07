/*
 * ----------------------------------------------------------------------
 * File:      RBTWithRecursions.js
 * Project:   RBTWithRecursion
 * Author:    Sanjay Vyas
 * 
 * Description:
 *    Red-Black Tree without using a parent pointer
 * ----------------------------------------------------------------------
 * Revision History:
 * 2020-Aug-08	[SV]: Created
 * ----------------------------------------------------------------------
 */
const readline = require('readline-sync');

function Node(value) {
  this.left = null;
  this.value = value;
  this.right = null;
  this.color = "R";

}

class Tree {
  constructor() {
    this.root = null;
    this.level = 0;
  }

  isRed(node) { return node && node.color == "R"; }

  isBlack(node) { return node == null || node.color == "B"; }

  flipColors(node) {
    node.color = this.isRed(node) ? "B" : "R"
    node.left.color = node.right.color = this.isRed(node) ? "B" : "R";
    return node;
  }

  rotateLeft(node) {
    let child = node.right;
    node.right = child.left;
    child.left = node;
    return child;
  }

  rotateRight(node) {
    let child = node.left;
    node.left = child.right;
    child.right = node;
    return child;
  }

  rotateLeftRight(node) {
    node.left = this.rotateLeft(node.left);
    node = this.rotateRight(node);
    return node;
  }

  rotateRightLeft(node) {
    node.right = this.rotateRight(node.right);
    node = this.rotateLeft(node);
    return node;
  }

  // We don't need parent pointer if we unwind upto the grand parent
  // then look down and do the rotation
  rebalance(node) {

    if (this.isRed(node.left) && this.isRed(node.left.left)) {
      if (this.isBlack(node.right))
        node = this.rotateRight(node);
      return this.flipColors(node);
    }

    if (this.isRed(node.left) && this.isRed(node.left.right)) {
      if (this.isBlack(node.right))
        node = this.rotateLeftRight(node);
      return this.flipColors(node);
    }

    if (this.isRed(node.right) && this.isRed(node.right.right)) {
      if (this.isBlack(node.left))
        node = this.rotateLeft(node);
      return this.flipColors(node);
    }

    if (this.isRed(node.right) && this.isRed(node.right.left)) {
      if (!this.isBlack(node.left))
        node = this.rotateRightLeft(node);
      return this.flipColors(node);
    }

    return node;
  }


  addNode(node, value) {
    if (!node)
      return new Node(value);

    if (value > node.value)
      node.right = this.addNode(node.right, value);
    else if (value < node.value)
      node.left = this.addNode(node.left, value);
    return this.rebalance(node);
  }

  // Little 'magic' function to print the tree as text tree 😊
  printDebug(node) {
    if (node) {
      this.level++;
      this.printDebug(node.right);
      console.log(" ".padStart((this.level - 1) * 4, ' ') + node.value + node.color);
      this.printDebug(node.left);
      this.level--;
    }
  }

  add(value) {
    this.root = this.addNode(this.root, value);
    this.root.color = "B";
  }

  printTree () {
    this.printDebug(this.root);
  }
}


function main() {
  let ped = new Tree();
  let value = 0;
  while (answer = readline.question("Enter a value (0 to stop): "),
    value = parseInt(answer),
    value != 0) {

    if (value != 0) {
      ped.add(value);
      ped.printTree();
    }
  }
}

main();