import { getTextInput, multiplier } from '../lib/util';

const input = getTextInput(__dirname, 'input.txt');

function parseInput(data: string): [estimate: number, schedule: number[]] {
  const [estimateText, scheduleText] = data.split('\n');
  return [
    parseInt(estimateText),
    scheduleText.split(',')
      .filter((i) => i !== 'x')
      .map((i) => parseInt(i))
  ];
}

function parseInputXNegOnes(data: string): [estimate: number, schedule: number[]] {
  const [estimateText, scheduleText] = data.split('\n');
  return [
    parseInt(estimateText),
    scheduleText.split(',')
      .map((i) => i === 'x' ? -1 : parseInt(i))
  ];
}

function findLowestWaitTime(time: number, buses: number[]): [waitTime: number, bus: number] {
  return buses.reduce<[number, number]>(([lowestWaitTime, bus], nextBus) => {
    const timeSinceDept = time % nextBus;
    if (timeSinceDept === 0) return [0, nextBus];
    const waitTime = nextBus - timeSinceDept;
    if (waitTime < lowestWaitTime) return [waitTime, nextBus];
    return [lowestWaitTime, bus];
  }, [Infinity, -1]);
}

function isMatch(timestamp: number, bus: number, offset: number): boolean {
  return (timestamp + offset) % bus === 0;
}

function findSyncTimestamp(buses: number[]): number {
  const filteredBuses = buses
    .map<[bus: number, offset: number]>((b, i) => [b, i])
    .filter(([b, _]) => b !== -1);

  let incr = 1;
  let timestamp = 0;
  for (let i = 0; i < filteredBuses.length - 1; i++) {
    const prevBus = filteredBuses[i][0];
    const nextBus = filteredBuses[i+1][0];
    const offset = filteredBuses[i+1][1];
    incr = incr * prevBus;
    while(!isMatch(timestamp, nextBus, offset)) {
      timestamp += incr;
    }
  }
  return timestamp;
}

const partOneInput = parseInput(input);
console.log('part1', findLowestWaitTime(...partOneInput).reduce(multiplier, 1));

const partTwoInput = parseInputXNegOnes(input);
console.log('part2', findSyncTimestamp(partTwoInput[1]));
