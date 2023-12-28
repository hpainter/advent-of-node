/**
 * Advent of Code 2023 Day X
 * https://adventofcode.com/2023/day/X
 */
const { readFile } = require('../../utils.js');

/**
 * 👯
 */
const solve = async (partNumber=1, inputFile='./input.txt') => {
  // convert input into an array of 2D pattern maps
  const patterns = parsePatterns(await readFile(inputFile));
  let solution = 0;
  switch (+partNumber) {
    case 1:
      // In part 1, find a set of mirrored rows or columns in each input pattern and
      // compute solution based on the axis.
      for (const pattern of patterns) {
        const rowIdx = reflectionRow(pattern);
        if (rowIdx !== -1) {
          // add 100x the axis index to solution for horizontal mirrors
          solution += 100 * (rowIdx + 1);
        }
        const columnIdx = reflectionCol(pattern);
        if (columnIdx !== -1) {
          // add 1x the axis index to solution for vertical mirrors
          solution += columnIdx + 1;
        }
      }
      break;
    case 2:
      // In part 2, find the mirrored rows/columns after changing a single element in
      // the input pattern.
      for (const pattern of patterns) {
        // set a flag for early exit once a valid pattern is found
        let found = false;

        // find the axis for the unmodified pattern so that we can ignore it when
        // testing out variants
        const ogRowIdx = reflectionRow(pattern);
        const ogColIdx = reflectionCol(pattern);

        // change each individual element of pattern and test for mirrored sets
        for (let i=0; i < pattern.length; i++) {
          for (let j=0; j < pattern[0].length; j++) {
            // build copy of pattern with one element toggled
            const testPattern = [];
            for (const p of pattern) { testPattern.push([...p]); }
            if (testPattern[i][j] === '.') {
              testPattern[i][j] = '#';
            } else {
              testPattern[i][j] = '.';
            }

            // check rows
            const rowIdx = reflectionRow(testPattern, ogRowIdx);
            if (rowIdx !== -1) {
              solution += 100 * (rowIdx + 1);
              found = true;
            }
            // check columns
            const columnIdx = reflectionCol(testPattern, ogColIdx);
            if (columnIdx !== -1) {
              solution += columnIdx + 1;
              found = true;
            }
            if (found) { break; }
          }
          if (found) { break; }
        }
      }
      break;
  }
  return solution;
};

// Find index of the pattern row to the immediate north of the mirror axis if
// it exists.  Use the optional ignoreIdx param to prevent that return value
// and search for a different axis instead.  Returns -1 if no mirrored row set is
// found.
const reflectionRow = (pattern, ignoreIdx=-1) => {
  let rowIdx = -1;

  // find first row that matches the subsequent row
  for (let i=0; i < (pattern.length - 1); i++) {
    if (sameRows(pattern, i, i+1)) {
      // check that rows continue to match as you travel out from the axis to
      // the nearest edge of the pattern
      let match = true;
      for (let j=1; i+j+1 < pattern.length; j++) {
        if (i - j < 0) { break; }
        if (!sameRows(pattern, i - j, i + j + 1)) {
          match = false;
          break;
        }
      }
      if (match && i !== ignoreIdx) {
        rowIdx = i;
        break;
      }
    }
  }
  return rowIdx;
};

// Find index of the pattern column to the immediate left of the mirror axis if
// it exists.  Use the optional ignoreIdx param to prevent that return value
// and search for a different axis instead.  Returns -1 if no mirrored column set is
// found.
const reflectionCol = (pattern, ignoreIdx=-1) => {
  let colIdx = -1;

  // find first column that matches the subsequent column
  for (let i=0; i < (pattern[0].length - 1); i++) {
    if (sameCols(pattern, i, i+1)) {
      // check that columns continue to match as you travel out from the axis to
      // the nearest edge of the pattern
      let match = true;
      for (let j=1; i+j+1 < pattern[0].length; j++) {
        if (i - j < 0) { break; } // detect left edge
        if (!sameCols(pattern, i-j, i+j+1)) {
          match = false;
          break;
        }
      }
      if (match && i !== ignoreIdx) {
        colIdx = i;
        break;
      }
    }
  }
  return colIdx;
};

// check if all elements of pattern in row a match row b
const sameRows = (pattern, a, b) => {
  return pattern[a].every((char, idx) => char === pattern[b][idx]);
}

// check if all elements of pattern in column a match column b
const sameCols = (pattern, a, b) => {
  const columnA = pattern.map(row => row[a]);
  const columnB = pattern.map(row => row[b]);
  return columnA.every((a, idx) => a === columnB[idx]);
};

// extract 2D pattern maps from input separated by blank lines
const parsePatterns = (lines) => {
  const patterns = [];
  let pattern = [];
  for (const line of lines) {
    if (line === '') {
      patterns.push(pattern);
      pattern = [];
      continue;
    }
    pattern.push(line.split(''));
  }
  patterns.push(pattern);
  return patterns;
};

module.exports = { solve }
