import { getTextInput } from '../lib/util';

const input = getTextInput(__dirname, 'input.txt');

type Operation = 'nop' | 'acc' | 'jmp';

type OperationMap = {
  [operation in Operation]: (acc: number, pos: number, val: number) => [number, number];
};

type Instruction = { operation: Operation, value: number };

const operations: OperationMap = {
  nop: (acc, pos, _val) => [acc, pos + 1],
  acc: (acc, pos, val) => [acc + val, pos + 1],
  jmp: (acc, pos, val) => [acc, pos + val]
}

function parseInput(input: string): Instruction[] {
  return input.split('\n').filter(Boolean).map((line): Instruction | false => {
    const [op, value] = line.split(' ');
    if (['nop', 'acc', 'jmp'].includes(op)) {
      return { operation: op as Operation, value: parseInt(value) }
    }
    return false;
  }).filter((instruction): instruction is Instruction => instruction !== false);
}

function processInstructions(instructions: Instruction[]): [boolean, number] {
  const visited = new Set<number>();
  let acc = 0;
  let pos = 0;
  while (!visited.has(pos) && pos < instructions.length) {
    visited.add(pos);
    const { operation, value } = instructions[pos];
    [acc, pos] = operations[operation](acc, pos, value);
  }
  return [visited.has(pos), acc];
}

function flipOperationAt(instructions: Instruction[], index: number): Instruction[] {
  return instructions.map((instruction, i) => {
    if (i === index) {
      if (instruction.operation === 'nop') return { ...instruction, operation: 'jmp' };
      if (instruction.operation === 'jmp') return { ...instruction, operation: 'nop' };
    }
    return instruction;
  })
}

function findCorruptOperation(instructions: Instruction[]): [number, number] {
  let flipped = 0;
  while (flipped < instructions.length - 1) {
    const [isLoop, acc] = processInstructions(flipOperationAt(instructions, flipped));
    if (!isLoop) {
      return [flipped, acc];
    }
    flipped++;
  }
  return [-1, -1]
}

const instructions = parseInput(input);

// part 1
console.log('part1', processInstructions(instructions));
console.log('part2', findCorruptOperation(instructions));
