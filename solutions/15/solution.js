/**
 * Advent of Code 2023 Day X
 * https://adventofcode.com/2023/day/X
 */
const { readFile } = require('../../utils.js');

/**
 * What's in the box, man???
 */
const solve = async (partNumber=1, inputFile='./input.txt') => {
  // split input on commas into 'step' strings
  const steps = (await readFile(inputFile))[0].split(',');
  let solution;
  switch (+partNumber) {
    case 1:
      // Part 1 requests the sum of the hashValue() result for each step string
      solution = steps.map(hashValue).reduce((total, n) => total + n, 0);
      break;
    case 2:
      // In part 2, each step needs to be further split into label/operation/value components.
      // After applying each operation in order to a fixed array of 256 'boxes', compute the
      // value for each box and sum the results.

      // initialize the set of 256 boxes as an array of Map objects
      const boxes = new Array(256);
      for (let i=0; i < boxes.length; i++) {
        boxes[i] = new Map();
      }
      // parse steps into label/operation/value components
      const updates = steps.map((step) => {
        return step.match(/(.+)(=|\-)(\d?)/).slice(1);
      });
      // apply all updates in order
      for (const update of updates) {
        // get number of box
        const boxNum = hashValue(update[0]);

        if (update[1] === '=') {
          // add/replace a lens
          boxes[boxNum].set(update[0],+update[2]);
        } else {
          // remove a lens
          boxes[boxNum].delete(update[0]);
        }
      }
      // sum box results for solution
      solution = boxes.reduce((total, box, idx) => {
        let boxValue = 0;
        const lenses = [...box];
        for (let i=0; i < box.size; i++) {
          boxValue += (1 + idx) * (1 + i) * lenses[i][1];
        }
        return total + boxValue;
      }, 0);
      break;
  }
  return solution;
};

/**
 * Compute the numeric 'HASH' value for a string from problem description
 */
const hashValue = (input) => {
  return input.split('').reduce((total, char, idx) => {
    return ((total + char.charCodeAt(0)) * 17) % 256
  }, 0);
};

module.exports = { solve }
