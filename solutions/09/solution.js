/**
 * Advent of Code 2023 Day 9
 * https://adventofcode.com/2023/day/9
 */
const { readFile } = require('../../utils.js');

// Sorry but a number series puzzle just isn't inspiring the usual quip
const solve = async (partNumber=1, inputFile='./input.txt') => {
  const input = await readFile(inputFile);

  // input is just vanilla number lists
  const sequences = input.map(i => i.split(' ').map(n => +n));

  let solution, reduction;
  switch (+partNumber) {
    case 1:
      // Calculate the next values in each series, where the next
      // value is the previous value plus the last number from each round
      // of subtraction.
      const nextValues = []; // next value for each sequence
      sequences.forEach((sequence) => {
        let next = sequence[sequence.length-1];
        reduction = sequence;
        while (!reduction.every(r => r === 0)) {
          reduction = diffolator(reduction);
          next += reduction[reduction.length-1];
        }
        nextValues.push(next);
      });

      // Part 1 requests the sum of all next values
      solution = nextValues.reduce((sum, n) => sum + n, 0);
      break;

    case 2:
      // Calculate the value that should precede each series, which is a
      // bit trickier.  Take the first number of the series and from each round
      // of subtraction as a list, travel it in reverse and reduce it using
      // each element minus the previous reduction result.

      const previousValues = []; // previous value for each sequence
      sequences.forEach((sequence) => {
        let firsts = [sequence[0]];
        reduction = sequence;
        while (!reduction.every(r => r === 0)) {
          reduction = diffolator(reduction);
          firsts.push(reduction[0]);
        }
        const previous = firsts.reverse().reduce((acc, n) => n - acc, 0);
        previousValues.push(previous);
      });

      // Part 2 requests the sum of all previous values
      solution = previousValues.reduce((sum, n) => sum + n, 0);
      break;
  }
  return solution;
};

/**
 * Compute the difference between each pair of elements in a numeric array.
 * [1, 3, 2] => [2, -1]
 */
const diffolator = (sequence) => {
  const diffs = [];
  for (let i=1; i < sequence.length; i++) {
    diffs.push(sequence[i] - sequence[i-1]);
  }
  return diffs;
};

module.exports = { solve }
