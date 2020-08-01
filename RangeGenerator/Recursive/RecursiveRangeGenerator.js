/*
 * ----------------------------------------------------------------------
 * File:      RecursiveRangeGenerator.js
 * Project:   Recursive
 * Author:    Sanjay Vyas
 * 
 * Description:
 *    Use recursion to generate a range
 * ----------------------------------------------------------------------
 * Revision History:
 * 2020-Aug-02	[SV]: Created
 * ----------------------------------------------------------------------
 */

let recursing = false;

// To disable: debug = nop
const nop = () => { };
let debug = console.log;

function* range(start, end, skip) {

  // Change to true to see unnecessary recursion
  if (!recursing) {
    debug(`Called for ${start}, ${end}, ${skip}`);

    // Sanity checks
    if ((start == undefined) ||
      (start != undefined && end == undefined && skip != undefined) ||
      (start < end && skip <= 0) ||
      start > end && skip >= 0)
      return null;

    // Check for situations like range(5) and make it range(0, 5)
    end == undefined && ([end, start] = [start, 0]);

    // If skip is undefined, set it to +1 or -1 depending on range
    !skip && (skip = (start < end) ? +1 : -1);
  }

  // While recursing, have we hit the end?
  if (start != end) {
    recursing = true;
    yield* range(start, end - skip, skip);
    yield end - skip;
  }
  recursing = false;
}

// Should print 10, 8, 6, 4, 2
console.log("range(10, 0, -2): ", [...range(10, 0, -2)]);


// Should print [ 0, 1, 2, 3, 4 ]
console.log("range(5): ", [...range(5)]);

// Should print [ 0, 1, 2 ]
console.log("range(0, 3): ", [...range(0, 3)]);

// Should print 6, 5, 4
console.log("range(6, 3): ", [...range(6, 3)]);

// Should print 6, 5, 4
console.log("range(6, 0, -2): ", [...range(6, 0, -2)]);

// Create enum using range(3)
var [RED, GREEN, BLUE] = range(3);
console.log(`RED=${RED}, GREEN=${GREEN}, BLUE=${BLUE}`);


// Should not print anything
console.log("range(): ", [...range()]);

// Should not print anything
console.log("range(0): ", [...range(0)]);

// Should print 2, 4, 6, 8
console.log("range(0, 10, 2): ", [...range(0, 10, 2)]);

// Should print 2, 4, 6, 8
console.log("range(10, undefined, 2): ", [...range(10, undefined, 2)]);

// Should print 5, 4, 3, 2, 1
console.log("range(5, 0): ", [...range(5, 0)]);
