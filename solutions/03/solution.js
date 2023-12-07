/**
 * Advent of Code 2023 Day 3
 * https://adventofcode.com/2023/day/3
 */
const { readFile } = require('../../utils.js');

/**
 * holding hands. touching you. touching me. SWEEEEEEEET CAROLINE
 */
const solve = async (partNumber=1, inputFile='./input.txt') => {
  const [labelMap, symbolMap] = parseInput(await readFile(inputFile));
  let solution = null;
  switch (+partNumber) {
    case 1:
      // determine which labels are part numbers
      const partNumbers = [];
      for (const label of labelMap) {
        if (isPartNumber(label, symbolMap)) {
          partNumbers.push(+label.value);
        }
      }
      // Part 1 requests sum of part numbers
      solution = partNumbers.reduce((total, x) => total + x, 0);
      break;

    case 2:
      // determine ratios for symbols that are gears
      const gearRatios = [];
      for (const symbol of symbolMap) {
        gearParts = isGearSymbol(symbol, labelMap);
        if (gearParts) {
          gearRatios.push(gearParts[0] * gearParts[1]);
        }
      }
      // Part 2 requests sum of gear ratios
      solution = gearRatios.reduce((total, x) => total + x, 0);
      break;
  }
  return solution;
};

/**
 * Treating the input schematic as a 2D character array, find the locations
 * of all potential part numbers (labels) and symbols in the schematic.  Each
 * mapped item is an object, eg:
 *
 * {
 *   value: '123',  // label or symbol string value
 *   row: 0,        // row index position of string value
 *   col: 12        // column index position of string value
 * }
 *
 * Returns [labelMap, symbolMap]
 */
const parseInput = (input) => {
  const labelMap = [];  // locations of numbers in schematic
  const symbolMap = []; // locations of symbols in schematic

  input.forEach( (line, i) => {
    // extract location of all numbers in line
    for (const match of line.matchAll(/(\d+)/g)) {
      labelMap.push({
        value: match[0], // digit string
        row: i,          // schematic map row
        col: match.index // schematic map column
      });
    }

    // extract location of all symbols in line
    for (const match of line.matchAll(/([^\.\d])/g)) {
      symbolMap.push({
        value: match[0], // symbol string
        row: i,          // schematic map row
        col: match.index // schematic map column
      });
    }
  });

  return [labelMap, symbolMap];
};

/**
 * Determine if a symbolMap[] location is adjacent to a labelMap[] location.
 */
const isAdjacent = (label, symbol) => {
  // check vertical distance
  if (Math.abs(label.row - symbol.row) > 1) { return false; }

  // check horizontal distance
  if (symbol.col < (label.col - 1)) { return false; }
  if (symbol.col > (label.col + label.value.length)) { return false; }

  return true;
};

/**
 * Determine if a labelMap[] location is adjacent to any item in symbolMap[].
 */
const isPartNumber = (location, symbolMap) => {
  return symbolMap.some((symbol) => isAdjacent(location, symbol));
};

/**
 * If a symbol represents a gear (*) and is adjacent to exactly two part
 * numbers, return an array containing the adjacent part numbers.  Otherwise
 * return false.
 */
const isGearSymbol = (location, labelMap) => {
  // gear symbols only
  if (location.value !== '*') { return false; }

  // find all part numbers adjacent to symbol
  const partNumbers = [];
  for (const label of labelMap) {
    if (isAdjacent(label, location)) { partNumbers.push(+label.value); }
  }
  if (partNumbers.length !== 2) { return false; }
  return partNumbers;
};

module.exports = { solve }
