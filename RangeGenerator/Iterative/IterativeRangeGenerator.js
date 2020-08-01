
function* range(start, end, skip) {

  // If end not provided, assume 0..start
  end == undefined && ([end, start] = [start, 0]);

  // Check order and set skip, if needed
  let ascending = start < end;

  if (ascending && skip <= 0 ||
    !ascending && skip >= 0)
    return null;

  !skip && (skip = ascending ? +1 : -1);

  // Set which direction we want to skip
  const condition =
    ascending
      ? ((value, end) => value < end)
      : ((value, end) => value > end);

  // Now 'yield' values in a loop
  for (var value = start;
    condition(value, end);
    value += skip)
    yield value;
}

// Should print [ 0, 1, 2, 3, 4 ]
console.log("range(5): ", [...range(5)]);

// Should print [ 0, 1, 2 ]
console.log("range(0, 3): ", [...range(0, 3)]);

// Should print 6, 5, 4
console.log("range(6, 3): ", [...range(6, 3)]);

// Should print 6, 4, 2
console.log("range(6, 0, -2): ", [...range(6, 0, -2)]);

// Create enum using range(3)
var [RED, GREEN, BLUE] = range(3);
console.log(`RED=${RED}, GREEN=${GREEN}, BLUE=${BLUE}`);

// Should print 10, 8, 6, 4, 2
console.log("range(10, 0, -2): ", [...range(10, 0, -2)]);

// Should not print anything
console.log("range(): ", [...range()]);

// Should not print anything
console.log("range(0): ", [...range(0)]);

// Should print 0, 2, 4, 6, 8
console.log("range(0, 10, 2): ", [...range(0, 10, 2)]);

// Should not print anything
console.log("range(10, undefined, 2): ", [...range(10, undefined, 2)]);

// Should print 5, 4, 3, 2, 1
console.log("range(5, 0): ", [...range(5, 0)]);
