import { getTextInput } from '../lib/util';

const input = getTextInput(__dirname, 'input.txt');

type SeatCodes = {
  row: string,
  col: string
}

type SeatLocation = {
  row: number,
  col: number
};

function parseInput(input: string): SeatCodes[] {
  return input.split('\n').filter(Boolean).map((line) => ({
    row: line.slice(0, 7),
    col: line.slice(7)
  }));
}

function createToBinary(zeroChar: string, oneChar: string): (input: string) => number {
  return (input) => parseInt(
    input
      .replace(new RegExp(zeroChar, 'g'), '0')
      .replace(new RegExp(oneChar, 'g'), '1'),
    2
  );
}

const rowToBinary = createToBinary('F', 'B');
const colToBinary = createToBinary('L', 'R');

function decodeSeatCodes({ row, col }: SeatCodes): SeatLocation {
  return {
    col: colToBinary(col),
    row: rowToBinary(row),
  }
}

function computeSeatId({ col, row }: SeatLocation): number {
  return row * 8 + col;
}

function findMissingMidNumber(nums: number[]): number | null {
  const sorted = nums.sort((a, b) => a - b);
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i + 1] - sorted[i] > 1) {
      return sorted[i] + 1
    }
  }
  return null;
}

const seatIds = parseInput(input)
  .map(decodeSeatCodes)
  .map(computeSeatId);

// part1
console.log('part1', Math.max(...seatIds));

// part2
console.log('part2', findMissingMidNumber(seatIds))
