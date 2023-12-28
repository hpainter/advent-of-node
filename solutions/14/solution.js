/**
 * Advent of Code 2023 Day X
 * https://adventofcode.com/2023/day/X
 */
const { readFile } = require('../../utils.js');

const solve = async (partNumber=1, inputFile='./input.txt') => {
  const platform = (await readFile(inputFile)).map(line => line.split(''));
  let tilted;
  let solution;
  switch (+partNumber) {
    case 1:
      // In part 1, migrate all 'O' chars in the platform map up until they butt
      // against a '#', 'O' or the north edge.  The solution is the count of 'O'
      // chars per row times the row distance from the south edge.
      tilted = rollNorth(platform);
      solution = computeLoad(tilted);
      break;

    case 2:
      // In part 2, migrate all 'O' chars as before to the north, then to the west, then south, then east.
      // Repeat the full cycle 1B times before computing solution.
      tilted = platform.map(p => [...p]); // copy of original platform
      let loads = [computeLoad(tilted)];  // track computed load values after each full tilt cycle
      for (let i=0; i < 1000000000; i++) {
        tilted = rollNorth(tilted);
        tilted = rollWest(tilted);
        tilted = rollSouth(tilted);
        tilted = rollEast(tilted);
        loads.push(computeLoad(tilted));

        // Instead of running the cycle a full 1B times, check for a repeating
        // sequence in the computed load values.  Arbitrarily look for sequence
        // lengths between 5 and 25, and if found we can skip ahead to the end.
        for (let j=5; j < Math.min(loads.length, 25); j++) {
          const tailA = loads.slice(loads.length-j,loads.length);
          const tailB = loads.slice(loads.length-j-j, loads.length-j);
          if (tailA.join(',') === tailB.join(',')) {
            // Repeating sequence has been detected; advance the loop counter to the last
            // multiple of the sequence length that is less than 1B:
            i += (tailA.length * Math.floor((1000000000 - i) / tailA.length));

            // For the remaining loops, copy the already computed load values from the
            // sequence until we complete our full billion.
            while(i < 999999999) {
              loads.push(tailA.shift());
              i += 1;
            }
            break;
          }
        }
      }
      solution = loads.pop();
      break;
  }
  return solution;
};

// compute load value for the given platform map, defined as the sum of the
// number of 'O' chars per row times the row distance from the south edge
const computeLoad = (platform) => {
  return platform.reduce((total, row, idx) => {
    const oCount = row.reduce((count, el) => {
      if (el === 'O') { return count + 1; }
      return count;
    }, 0);

    return total + ((platform.length - idx) * oCount);
  }, 0);
};

// Migrate all 'O' characters in the given platform map north until they butt
// up against a '#', 'O' or the north edge of the map.  Returns modified
// platform map.
const rollNorth = (platform) => {
  const tilted = [];  // modified platform map
  const log = [];     // log of 'O' char coordinates that have been migrated as 'x,y' strings

  for (let i=0; i < platform.length; i++) {
    const row = platform[i].map((n, j) => {
      let symbol = n;
      // '#' symbols never move
      if (n === '#') { return symbol; }

      // 'O' symbol that has not been previously moved
      if (n === 'O' && !log.includes('' + i + ',' + j)) {
        return symbol;
      }

      // provisionally assume this element is an empty '.' space, then search
      // down the column until we encounter either a '#' or an unmigrated 'O'
      symbol = '.';
      for (let r = i+1; r < platform.length; r++) {
        if (platform[r][j] === '#') {
          // no 'O' between current spot and the next '#'
          break;
        }

        if (platform[r][j] === 'O' && !log.includes('' + r + ',' + j)) {
          // un-migrated 'O' found further down the column, move it up to our
          // empty spot and log the move.
          symbol = 'O';
          log.push('' + r + ',' + j);
          break;
        }
      }
      // set the symbol in the modified map row
      return symbol;
    });

    // add modified row to platform map
    tilted.push(row);
  }

  return tilted;
};

// Migrate all 'O' characters in the given platform map west until they butt
// up against a '#', 'O' or the west edge of the map.  Returns modified
// platform map.
const rollWest = (platform) => {
  const tilted = [];  // modified platform map
  const log = [];     // log of 'O' char coordinates that have been migrated as 'x,y' strings

  for (let i=0; i < platform.length; i++) {
    const row = platform[i].map((n, j) => {
      let symbol = n;
      // '#' symbols never move
      if (n === '#') { return symbol; }

      // 'O' symbol that has not been previously moved
      if (n === 'O' && !log.includes('' + i + ',' + j)) {
        return symbol;
      }

      // provisionally assume this element is an empty '.' space, then search
      // across the row until we encounter either a '#' or an unmigrated 'O'
      symbol = '.';
      for (let r = j+1; r < platform[i].length; r++) {
        if (platform[i][r] === '#') {
          // no 'O' between current spot and the next '#'
          break;
        }
        if (platform[i][r] === 'O' && !log.includes('' + i + ',' + r)) {
          // un-migrated 'O' found further along the row, move it up to our
          // empty spot and log the move.
          symbol = 'O';
          log.push('' + i + ',' + r);
          break;
        }
      }

      // set the symbol in the modified map row
      return symbol;
    });

    // add modified row to platform map
    tilted.push(row);
  }

  return tilted;
};

// Inverse of rollNorth
const rollSouth = (platform) => {
  return rollNorth(platform.toReversed()).toReversed();
};

// Inverse of rollWest
const rollEast = (platform) => {
  return rollWest(platform.map(p => p.toReversed())).map(p => p.toReversed());
};

module.exports = { solve }
