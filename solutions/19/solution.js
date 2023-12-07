/**
 * Advent of Code 2023 Day X
 * https://adventofcode.com/2023/day/X
 */
const { readFile } = require('../../utils.js');

/**
 * ...
 */
const solve = async (partNumber=1, inputFile='./input.txt') => {
  const input = await readFile(inputFile);
  let solution;
  switch (+partNumber) {
    case 1:
      // solve part 1
      break;
    case 2:
      // solve part 2
      break;
  }
  return solution;
};

module.exports = { solve }
