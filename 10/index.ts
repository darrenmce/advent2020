import { getTextInput } from '../lib/util';

const input = getTextInput(__dirname, 'input.txt');

function parseInput(input: string): number[] {
  return input.split('\n').filter(Boolean).map((n) => parseInt(n, 10));
}

function findJolts(sortedAdapters: number[]): [number, number] {
  let ones = 0;
  let threes = 0;
  let jolts = 0;
  sortedAdapters.forEach((adapter) => {
    if (adapter - jolts === 1) ones++;
    if (adapter - jolts === 3) threes++;
    jolts = adapter;
  });
  return [ones, threes + 1]
}

async function countArrangements(countCache: Record<number, Promise<number>>, sortedAdapters: number[], adapterIndex: number, target: number): Promise<number> {
  const jolts = adapterIndex >= 0 && adapterIndex <= sortedAdapters.length ? sortedAdapters[adapterIndex] : 0;
  if (jolts + 3 === target) {
    return 1;
  }
  const eligibleAdapters = sortedAdapters
    .slice(adapterIndex + 1, adapterIndex + 4)
    .filter((a) => a - jolts <= 3);

  const eligibleAdapterIndexes = eligibleAdapters.map(a => sortedAdapters.indexOf(a));
  let sum = 0;
  for (const index of eligibleAdapterIndexes) {
    // optimize/dedupe the recursion
    if (!countCache[index]) {
      countCache[index] = countArrangements(countCache, sortedAdapters, index, target);
    }
    sum += await countCache[index];
  }
  return sum;
}

const numbers = parseInput(input).sort((a, b) => a - b);

const part1 = findJolts(numbers);
console.log('part1', part1, part1[0] * part1[1]);

countArrangements({}, numbers, -1, Math.max(...numbers) + 3).then((part2) => {
  console.log('part2', part2)
})
