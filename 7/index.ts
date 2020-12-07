import { getTextInput } from '../lib/util';

const input = getTextInput(__dirname, 'input.txt');

type Bags = {
  [colour: string]: Array<[number, string]>
}

const NO_BAGS = 'no other bags.';
const BAGS_CONTAIN = ' bags contain ';

function parseContains(contains: string): Array<[number, string]> {
  if (contains === NO_BAGS) return [];
  return contains.split(',').map((contents) => {
    const [num, ...colour] = contents.replace(/bags?\.?$/, '').trim().split(' ');
    return [parseInt(num), colour.join(' ')];
  })
}

function parseInput(input: string): Bags {
  const lines = input.split('\n').filter(Boolean);
  return lines.reduce<Bags>((bags, line) => {
    const [colour, contains] = line.split(BAGS_CONTAIN);
    bags[colour] = parseContains(contains);
    return bags;
  }, {});
}

function findAllThatContain(bags: Bags, findColour: string): string[] {
  const topLevel = Object.entries(bags)
    .filter(([_, contains]) => contains.some(([num, colour]) => num > 0 && colour === findColour))
    .map(([colour, _]) => colour);
  return Array.from(new Set(topLevel.concat(
    ...topLevel.map(findAllThatContain.bind(null, bags))
  )));
}

function findAllWithin(allBags: Bags, findColour: string, countSelf = false): number {
  const withinBag = allBags[findColour];
  if (!withinBag || withinBag.length === 0) return 1;
  return withinBag.reduce<number>((bags, [num, colour]) =>
    bags + (num * (findAllWithin(allBags, colour, true)))
  , countSelf ? 1 : 0)
}

const bagsData = parseInput(input);

console.log('part1', findAllThatContain(bagsData, 'shiny gold').length);
console.log('part2', findAllWithin(bagsData, 'shiny gold'));
