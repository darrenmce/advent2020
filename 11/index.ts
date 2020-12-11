import R from 'ramda';
import { getTextInput } from '../lib/util';

const input = getTextInput(__dirname, 'input.txt');

type Seat = 'L' | '#' | '.';
type SeatChart = Seat[][];
type Mover = (x: number, y: number) => [number, number]

function parseInput(input: string): SeatChart {
  return input.split('\n').filter(Boolean).map((line) => line.split('') as Seat[]);
}

function getSeat(chart: SeatChart, x: number, y: number): Seat | null {
  if (x < 0 || y < 0 || x >= chart[0].length || y >= chart.length) return null;
  return chart[y][x];
}

function getAdjacentSeats(chart: SeatChart, x: number, y: number): Seat[] {
  return [
    [x-1, y-1], [x, y-1], [x+1, y-1],
    [x-1, y], [x+1, y],
    [x-1, y+1], [x, y+1], [x+1, y+1]
  ].map(([x, y]) => getSeat(chart, x, y))
  .filter((s): s is Seat => s !== null);
}

type GetSeats = (chart: SeatChart, x: number, y: number) => Seat[];

function applySeatRules(adjacentSeatGetter: GetSeats, occThreshold: number, chart: SeatChart): SeatChart {
  return chart.map((row, y) =>
    row.map((seat, x) => {
      if (seat === 'L') {
        const adj = adjacentSeatGetter(chart, x, y);
        if (!adj.includes('#')) {
          return '#';
        }
      } else if (seat === '#') {
        const adj = adjacentSeatGetter(chart, x, y);
        if (adj.filter(s => s === '#').length >= occThreshold) {
          return 'L';
        }
      }
      return seat;
    })
  );
}

function getFirstSeat(chart: SeatChart, x: number, y: number, mover: Mover): Seat | null {
  let seat: Seat | null;
  let posX = x;
  let posY = y;
  do {
    [posX, posY] = mover(posX, posY);
    seat = getSeat(chart, posX, posY);
  } while(seat === '.');
  return seat;
}

function getVisibleAdjacentSeats(chart: SeatChart, x: number, y: number): Seat[] {
  const movers: Mover[] = [
    (x,y) => [x-1, y-1], (x,y) => [x, y-1], (x,y) => [x+1, y-1],
    (x,y) => [x-1, y], (x,y) => [x+1, y],
    (x,y) => [x-1, y+1], (x,y) => [x, y+1], (x,y) => [x+1, y+1]
  ];

  return movers.map((mover) => getFirstSeat(chart, x, y, mover))
    .filter((s): s is Seat => s !== null);
}

function applyRulesUntilStable(chart: SeatChart, applyRules: (chart: SeatChart) => SeatChart): SeatChart {
  let prevChart: SeatChart = [];
  let nextChart: SeatChart = chart;
  while(!R.equals(prevChart, nextChart)) {
    prevChart = nextChart;
    nextChart = applyRules(prevChart);
  }
  return nextChart;
}

function countOccupiedSeats(chart: SeatChart): number {
  let occ = 0;
  for (const row of chart) {
    for (const seat of row) {
      if (seat === '#') occ++
    }
  }
  return occ;
}

const seatChart = parseInput(input);

console.log('part1',
  countOccupiedSeats(
    applyRulesUntilStable(seatChart, applySeatRules.bind(null, getAdjacentSeats, 4))
  )
);
console.log('part2',
  countOccupiedSeats(
    applyRulesUntilStable(seatChart, applySeatRules.bind(null, getVisibleAdjacentSeats, 5))
  )
);
