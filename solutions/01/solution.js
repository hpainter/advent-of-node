/**
 * Advent of Code 2023 Day 1
 * https://adventofcode.com/2023/day/1
 */
const { readFile } = require('../../utils.js');

// holiday! calibrate!
const solve = async (partNumber=1, inputFile='./input.txt') => {
  const rawValues = await readFile(inputFile);
  let calibrationValues = [];
  switch (+partNumber) {
    case 1:
      // parse value using digits
      calibrationValues = rawValues.map(calibrationValueDigits);
      break;
    case 2:
      // parse value using words + digits
      calibrationValues = rawValues.map(calibrationValueWords);
      break;
  }
  // solution for both parts 1 + 2 is sum of calibration values
  return calibrationValues.reduce((total, x) => total + x, 0);
};

/**
 * Convert the first + last digits in a string into a two-digit number.
 *
 * Examples:
 *   'a1b2c3' => 13
 *   'a1bc'   => 11
 */
const calibrationValueDigits = (line) => {
  // strip out non-digit chars from line
  lineInts = line.split('')
                 .map((n) => +n)
                 .filter(Number.isInteger)

  first = lineInts[0];   // first number in line
  last = lineInts.pop(); // last number in line

  return first * 10 + last;
};

/**
 * Convert the first + last numbers in a string into a two-digit number, also
 * accepting number words.
 *
 * Examples:
 *   'a1b2cthree' => 13
 *   'aoneightbc' => 18
 */
const calibrationValueWords = (line) => {
  const validWords = [
    'one', 'two', 'three', 'four', 'five',
    'six', 'seven', 'eight', 'nine'
  ];

  // regex matching any single digit or validWords[] element
  const re = new RegExp('\\d|' + validWords.join('|'), 'g')

  // extract numbers from line
  const matches = []
  while ((match = re.exec(line)) !== null) {
    matches.push(match);
    // To account for overlapping number words (eg 'nineight'), move the start
    // index back one spot before the next exec().  Do not move the index back
    // if we matched a digit or else the loop will hang.
    if(re.lastIndex > 0 && match[0].length > 1){
      re.lastIndex -= 1;
    }
  }
  first = matches[0][0];   // first number in line
  last = matches.pop()[0]; // last number in line

  // replace number words with digit chars:
  validWords.forEach((word, idx) => {
    first = first.replace(word, idx + 1 + '')
    last = last.replace(word, idx + 1 + '')
  });

  // re-use original function to calculate value
  return calibrationValueDigits(first + last);
};

module.exports = { solve }
