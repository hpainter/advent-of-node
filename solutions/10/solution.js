/**
 * Advent of Code 2023 Day 10
 * https://adventofcode.com/2023/day/10
 */
const { readFile } = require('../../utils.js');

/**
 * If good fences make good neighbors, what do absolutely insane fences make?
 */
const solve = async (partNumber=1, inputFile='./input.txt') => {
  const [map, start] = buildMap(await readFile(inputFile));

  let solution;
  switch (+partNumber) {
    case 1:
      // Part 1 requests the number of steps to the halfway point of the map loop
      solution = roundTrip(start[0], start[1], map).length / 2;
      break;

    case 2:
      // Part 2 request count of all tiles enclosed by the loop
      const loop = roundTrip(start[0], start[1], map);

      // add start position to loop
      loop.unshift(start);

      // set key type of start position. NOTE: 'S' is an 'L' in the input,
      // but ideally this would be determined programmatically
      map[start[1]][start[0]] = 'L';

      // rewrite map to only contain the loop path
      const loopMap = pathOnly(loop, map);

      // total enclosed tiles
      let tileCount = 0;

      for (let y=0; y < map.length; y++) {
        for (let x=0; x < map[0].length; x++) {
          // select all path coordinates in the same column as current position
          const pathColumn = loop.filter(p => p[0] === x);

          // skip unless this is an empty tile
          if(loopMap[y][x] !== '.') { continue; }

          // To make the inside/outside determination, count the number of 'connections'
          // to the left and right of our current column that the path makes in either of the
          // vertical directions. For example, a `-` connects to both left and right while a 'L'
          // connects only to the left.
          let [left, right] = [0, 0];

          for (const cell of pathColumn) {
            // only checking path tiles above our position
            if (cell[1] > y) { continue; } 

            // get symbol of path tile and increment cxn counts
            const tile = map[cell[1]][cell[0]];
            switch (tile) {
              case 'F':
              case 'L':
                right += 1;
                break;
              case '-':
                right += 1;
                left += 1;
                break;
              case '7':
              case 'J':
                left += 1;
                break;
            }
          }

          // If the total connection count in both directions is an odd number,
          // then we are 'inside' the loop.  Why this works I am not entirely
          // sure but it really do be that way sometimes.
          if ([left, right].every(count => (count % 2) !== 0)) {
            tileCount += 1;

            // colorize the loopMap tile for debugging display
            loopMap[y][x] = '\x1b[31m' + loopMap[y][x] + '\x1b[0m';
          }
        }
      }
      // NOTE: prints out the path-only map with interior cells colored red
      // loopMap.forEach(l => console.log(l.join('')));

      solution = tileCount;
      break;
  }
  return solution;
};

/**
 * Transform original map so that all non-path cells are replaced by .
 */
const pathOnly = (path, map) => {
  const newMap = [];
  for (let y=0; y < map.length; y++) {
    const row = path.filter(p => p[1] === y);
    const out = new Array(map[0].length).fill('.');
    row.forEach((cell,idx) => {
      out[cell[0]] = map[y][cell[0]];
    });
    newMap.push(out);
  }
  return newMap;
};

/** 
 * Trace round trip path around map loop starting at (x, y).
 * Returns list of coordinates, eg [ [x1,y1], [x2,y2], ... ]
 */
const roundTrip = (x, y, map) => {
  // Offsets of valid next positions for each type of map symbol
  const mapKey = {
    '-': [ [-1,  0], [1,  0] ],
    'F': [ [ 0,  1], [1,  0] ],
    '|': [ [ 0, -1], [0,  1] ],
    'L': [ [ 0, -1], [1,  0] ],
    '7': [ [-1,  0], [0,  1] ],
    'J': [ [-1,  0], [0, -1] ],
  };

  // find a valid first step from our start, assume we aren't on an edge
  let stepTo;
  if (['-', 'F', 'L'].includes(map[x-1][y])) { stepTo = [x-1, y]; }
  else if (['-', '7', 'J'].includes(map[x+1][y])) { stepTo = [x+1, y]; }
  else if (['|', '7', 'F'].includes(map[x][y-1])) { stepTo = [x, y-1]; }
  else if (['|', 'J', 'L'].includes(map[x][y+1])) { stepTo = [x, y+1]; }

  const path = [stepTo];
  let lastPosition = [x, y];
  while(map[stepTo[1]][stepTo[0]] !== 'S') {
    const key = map[stepTo[1]][stepTo[0]];
    for (const dir of [0, 1]) {
      const nextX = stepTo[0] + mapKey[key][dir][0];
      const nextY = stepTo[1] + mapKey[key][dir][1];
      if ( nextX !== lastPosition[0] || nextY !== lastPosition[1] ) {
        lastPosition = [...stepTo];
        stepTo = [nextX, nextY];
        path.push(stepTo);
        break;
      }
    }
  }
  return path;
};

/**
 * Parse input into a 2D grid and find the start position coordinates
 */
const buildMap = (input) => {
  const map = [];
  let startPosition = [0,0];
  for (let y=0; y < input.length; y++) {
    map.push(input[y].split(''));
    const x = input[y].indexOf('S');
    if (x !== -1) { startPosition = [x, y]; }
  };
  return [map, startPosition];
};

module.exports = { solve }
