import { getTextInput, sumReducer } from '../lib/util';

const input = getTextInput(__dirname, 'input.txt');

type GroupAnswers = Record<string, true>;
type GroupAllAnswers = Record<string, number>;

function parseInput(input: string): string[] {
  return input.split('\n\n')
}

function parseGroup(group: string): string[] {
  return group.split('\n').filter(Boolean);
}

function countYes(groups: string[]): number {
  return groups.map((group) =>
    parseGroup(group)
        .reduce<GroupAnswers>((answers, line) => {
          line.split('').forEach((char) => {
            answers[char] = true;
          })
          return answers;
        }, {}))
    .map((groupAnswers) => Object.keys(groupAnswers).length)
    .reduce(sumReducer, 0)
}

function countAllYes(groups: string[]): number {
  return groups.map((group) => {
      const lines = parseGroup(group)
      const groupCounts = lines.reduce<GroupAllAnswers>((answers, line) => {
        line.split('').forEach((char) => {
          answers[char] = answers[char] ? answers[char] + 1 : 1;
        })
        return answers;
      }, {})

      return Object.keys(groupCounts)
        .filter((key) => groupCounts[key] === lines.length)
        .length
    })
    .reduce(sumReducer, 0)
}

const groups = parseInput(input)

// part 1
const part1 = countYes(groups);
console.log('part1', part1);

// part 2
const part2 = countAllYes(groups);
console.log('part2', part2);
