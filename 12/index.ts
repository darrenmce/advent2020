import { getTextInput } from '../lib/util';

const input = getTextInput(__dirname, 'input.txt');

type Direction = 'N' | 'S' | 'E' | 'W';
type Action = Direction | 'L' | 'R' | 'F';
type Instruction = [action: Action, value: number];
type Coords = [x: number, y: number];
type DirCoords = [Direction, Coords];
type WaypointCoords = [waypoint: Coords, ship: Coords];

function parseInput(input: string): Instruction[] {
  return input.split('\n')
    .filter(Boolean)
    .map((line) => [line.charAt(0) as Action, parseInt(line.slice(1))]);
}

const move: Record<Direction, (coords: Coords, val: number) => Coords> = {
  E: ([x, y], val) => [x+val, y],
  S: ([x, y], val) => [x, y-val],
  W: ([x, y], val) => [x-val, y],
  N: ([x, y], val) => [x, y+val]
}
const DIR_ORDER: Direction[] = ['N', 'E', 'S', 'W'];
function rotate(facing: Direction, degrees: number) {
  const changeIndex = DIR_ORDER.indexOf(facing) + (degrees % 360) / 90;
  return DIR_ORDER[changeIndex < 0 ? DIR_ORDER.length + changeIndex : changeIndex  % 4];
}

const RAD_CONST = Math.PI / 180;
function rotateCoords([x, y]: Coords, degrees: number): Coords {
  const rads = -degrees * RAD_CONST; // flip degrees to effectively rotate clockwise
  const cos = Math.round(Math.cos(rads)) // round cuz floating point makes this a terrible time (we are assuming whole numbers since only 90deg turns)
  const sin = Math.round(Math.sin(rads));
  return [x * cos - y * sin, x * sin + y * cos];
}

function processInstruction([action, value]: Instruction, facing: Direction, coords: Coords): DirCoords {
  switch (action) {
    case 'F': return processInstruction([facing, value], facing, coords);
    case 'L': return [rotate(facing, -value), coords];
    case 'R': return [rotate(facing, value), coords];
    default: return [facing, move[action](coords, value)];
  }
}

function processWaypointInstruction([action, value]: Instruction, waypoint: Coords, coords: Coords): WaypointCoords {
  switch (action) {
    case 'F': return [waypoint, [coords[0] + (waypoint[0] * value), coords[1] + (waypoint[1] * value)]];
    case 'L': return [rotateCoords(waypoint, -value), coords];
    case 'R': return [rotateCoords(waypoint, value), coords];
    default: return [move[action](waypoint, value), coords];
  }
}

function processAllInstructions(instructions: Instruction[], facing: Direction, startingCoords: Coords): DirCoords {
  return instructions.reduce<DirCoords>(([dir, coords], instruction) => processInstruction(instruction, dir, coords)
    , [facing, startingCoords]);
}

function processWPInstructions(instructions: Instruction[], initialWp: Coords, initialCoords: Coords): WaypointCoords {
  return instructions.reduce<WaypointCoords>(([waypoint, coords], instruction) =>
    processWaypointInstruction(instruction, waypoint, coords)
    , [initialWp, initialCoords])
}

function calcManhattanDistance([_, coords]: DirCoords | WaypointCoords): number {
  return Math.abs(coords[0]) + Math.abs(coords[1]);
}

const instructions = parseInput(input);

console.log('part1', calcManhattanDistance(
  processAllInstructions(instructions, 'E', [0, 0])
));

console.log('part2', calcManhattanDistance(
  processWPInstructions(instructions, [10, 1], [0, 0])
));

