const input: number[] = require('./input.json');

function findTwoThatAddTo(input: number[], addTo: number) {
  for (let i = 0; i < input.length; i++) {
    const num = input[i];
    const missing = addTo - num;
    if (input.slice(i+1).indexOf(missing) >= 0) {
      return [num, missing];
    }
  }
  return null;
}

function findThreeThatAddTo(input: number[], addTo: number) {
  for (let i = 0; i < input.length; i++) {
    const num = input[i];
    const missing = addTo - num;
    const otherTwo = findTwoThatAddTo([...input].splice(i), missing);
    if (otherTwo !== null) {
      return [num, ...otherTwo];
    }
  }
  return null;
}

const multiplier = (x: number, y: number) => x * y;


// part one
const part1 = findTwoThatAddTo(input, 2020);
if (part1 === null) {
  console.log('no solution for part 1!')
} else {
  console.log('part1', part1, part1.reduce(multiplier , 1))
}

// part two
const part2 = findThreeThatAddTo(input, 2020);
if (part2 === null) {
  console.log('no solution for part 2!')
} else {
  console.log('part2', part2, part2.reduce(multiplier , 1))
}
