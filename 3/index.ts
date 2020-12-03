import { getTextInput, multiplier } from '../lib/util';

const input = getTextInput(__dirname, 'input.txt');

type TreeData = {
  rowLength: number,
  treeIndices: number[][]
}

function parseInput(text: string): TreeData {
  const lines = text.split('\n');

  const treeIndices = lines.map((line) =>
    line.split('').reduce<number[]>((prev, next, i) =>
      next === '#' ?  prev.concat(i): prev
    , [])
  );

  return {
    rowLength: lines[0].length,
    treeIndices
  }
}

function countTreeHits(treeData: TreeData, moveX: number, moveY: number): number {
  let pos = 0 - moveX;
  return treeData.treeIndices.reduce<number>((hits, treeLocations, i) => {
    if (i % moveY !== 0) return hits;
    pos += moveX;
    return treeLocations.includes(pos % treeData.rowLength) ? hits + 1 : hits;
  }, 0);
}

const treeData = parseInput(input);

//part 1
console.log('part1', countTreeHits(treeData, 3, 1));

//part 2
const part2 = [
  countTreeHits(treeData, 1, 1),
  countTreeHits(treeData, 3, 1),
  countTreeHits(treeData, 5, 1),
  countTreeHits(treeData, 7, 1),
  countTreeHits(treeData, 1, 2)
]
console.log('part2', part2, part2.reduce(multiplier, 1))

