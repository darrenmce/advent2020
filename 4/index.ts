import { getTextInput } from '../lib/util';

const input = getTextInput(__dirname, 'input.txt');

const passportFields = <const>['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];
type PassportField = typeof passportFields[number];

type ValidPassportData = Record<PassportField, string>;
type PassportData = Partial<ValidPassportData>;

function parsePassport(data: string): PassportData {
  return data.replace(/\n/g, ' ').split(' ')
    .reduce<PassportData>((data, segment) => {
      const [field, val] = segment.split(':');
      if (passportFields.includes(field as PassportField)) {
        data[field as PassportField] = val;
      }
      return data;
    }, {})
}

function checkIsValid(passport: PassportData): passport is ValidPassportData {
  return passportFields.every((f) => passport[f] !== undefined);
}

function parseAndMinMaxCheck(field: string, min: number, max: number): boolean {
  const num = parseInt(field);
  return !(isNaN(num) || num < min || num > max);
}

const HAIR_COLOUR_REGEX = /^#[0-9a-f]{6}$/;
const EYE_COLOURS = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'];
const PID_REGEX = /^[0-9]{9}$/;

function checkFields(p: ValidPassportData): boolean {
  return parseAndMinMaxCheck(p.byr, 1920, 2002) &&
    parseAndMinMaxCheck(p.iyr, 2010, 2020) &&
    parseAndMinMaxCheck(p.eyr, 2020, 2030) &&
    (
      (p.hgt.endsWith('cm') && parseAndMinMaxCheck(p.hgt.slice(0, -2), 150, 193)) ||
      (p.hgt.endsWith('in') && parseAndMinMaxCheck(p.hgt.slice(0, -2), 59, 76))
    ) &&
    HAIR_COLOUR_REGEX.test(p.hcl) &&
    EYE_COLOURS.includes(p.ecl) &&
    PID_REGEX.test(p.pid)
}

const passportData: PassportData[] = input.split('\n\n').map(parsePassport);

const part1 = passportData.filter(checkIsValid).length;
console.log('part1', part1);

const part2 = passportData.filter(checkIsValid).filter(checkFields).length;
console.log('part2', part2);

