import { getTextInput } from '../lib/util';

const input = getTextInput(__dirname, 'input.txt');

function parseInput(input: string): number[] {
  return input.split('\n').filter(Boolean).map((n) => parseInt(n, 10));
}

function validateNumber(preamble: number[], num: number): boolean {
  return preamble.some((x, i) => {
    const yIndex = preamble.indexOf(num - x);
    return yIndex >= 0 && yIndex !== i;
  });
}

function findInvalidNumber(preambleLength: number, numbers: number[]): number {
  let set = numbers;
  while(set.length > preambleLength) {
    if (!validateNumber(set.slice(0, preambleLength), set[preambleLength])) {
      return set[preambleLength];
    }
    set = set.slice(1);
  }
  return -1;
}

function findContiguousSum(numbers: number[], findSum: number): number[] {
  for (let i = 0; i < numbers.length; i++) {
    let j = i;
    let sum = numbers[i];
    const range = [numbers[i]];
    while(sum < findSum) {
      sum += numbers[++j];
      range.push(numbers[j]);
      if (sum === findSum) {
        return range;
      }
    }
  }
  return [];
}

const numbers = parseInput(input);

const part1 = findInvalidNumber(25, numbers);
console.log('part1', part1);

const part2 = findContiguousSum(numbers, part1);
console.log('part2', Math.max(...part2) + Math.min(...part2));

