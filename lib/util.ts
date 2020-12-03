import fs from 'fs';
import path from 'path';

export function getTextInput(...paths: string[]): string {
  return fs.readFileSync(path.resolve(...paths), { encoding: 'utf-8' });
}

export const multiplier = (x: number, y: number) => x * y;
