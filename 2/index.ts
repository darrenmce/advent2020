import { getTextInput } from '../lib/util';

const input = getTextInput(__dirname, 'input.txt');

function parsePassword(line: string): [number, number, string, string] {
  const [range, char, password] = line.split(' ');
  const [minString, maxString] = range.split('-');
  return [parseInt(minString), parseInt(maxString), char.slice(0, -1), password];
}

function checkPassword1(min: number, max: number, char: string, password: string): boolean {
  const count = password.split(char).length - 1;
  return min <= count && count <= max;
}

function checkPassword2(firstPos: number, secondPos: number, char: string, password: string): boolean {
  const first = password.charAt(firstPos - 1) === char;
  const second = password.charAt(secondPos - 1) === char;

  return (first && !second) || (!first && second);
}

function inputChecker(input: string, passwordChecker: (x: number, y: number, char: string, password: string) => boolean): number {
  return input.split('\n').filter(l => !!l).reduce<number>((validCount, line) =>
      passwordChecker(...parsePassword(line)) ? validCount + 1 : validCount
    , 0)
}

// part 1
const part1 = inputChecker(input, checkPassword1);
console.log('part1', part1);

// part 2
const part2 = inputChecker(input, checkPassword2);
console.log('part2', part2);

