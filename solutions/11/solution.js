/**
 * Advent of Code 2023 Day 11
 * https://adventofcode.com/2023/day/11
 */
const { readFile } = require('../../utils.js');

/**
 * If I hear 'how much longer?' one more time I swear I am going to turn this
 * spaceship around and head home.
 */
const solve = async (partNumber=1, inputFile='./input.txt') => {
  // convert input into 2D galaxy map
  const galaxyMap = (await readFile(inputFile)).map(line => line.split(''));

  let solution;
  switch (+partNumber) {
    case 1:
      // Part 1 requests the sum of the manhattan distance between each pair of
      // galaxies after accounting for 1x expansion.
      const expandedMap = expand(galaxyMap);
      const galaxies1x = findGalaxies(expandedMap);
      const pairs1x = pairGalaxies(galaxies1x);
      const distances1x = pairs1x.map((pair) => {
        const [g1, g2] = [galaxies1x[pair[0]], galaxies1x[pair[1]]]
        return Math.abs(g1[0] - g2[0]) + Math.abs(g1[1] - g2[1]);
      });
      solution = distances1x.reduce((total, dist) => total += dist);
      break;

    case 2:
      // Part 2 requests same thing, except with 999_999x expansion.  Building
      // an expanded map is impractical, so here we just work with the
      // original. When calculating distance between a pair of galaxies, add
      // (expansion factor * number empty rows between pair) to the y distance
      // and (expansion factor * number empty cols between pair) to the x
      // distance
      const galaxies = findGalaxies(galaxyMap);
      const [expandCols, expandRows] = findEmpties(galaxyMap);
      const pairs = pairGalaxies(galaxies);

      const distances = pairs.map((pair) => {
        const [g1, g2] = [galaxies[pair[0]], galaxies[pair[1]]];

        // num empty columns between pair
        const expandX = expandCols.filter((idx) => {
          return idx > Math.min(g1[0],g2[0]) && idx < Math.max(g1[0],g2[0]);
        }).length;

        // num empty rows between pair
        const expandY = expandRows.filter((idx) => {
          return idx > Math.min(g1[1],g2[1]) && idx < Math.max(g1[1],g2[1]);
        }).length;

        const distanceX = Math.abs(g1[0] - g2[0]) + (expandX * 999999);
        const distanceY = Math.abs(g1[1] - g2[1]) + (expandY * 999999);
        return distanceX + distanceY;
      });
      solution = distances.reduce((total, dist) => total += dist);
      break;
  }
  return solution;
};

/**
 * Find all pair permutations of the galaxy list. Returns an array of index
 * tuples for the galaxies, [ [idx, idx], [idx, idx], ... ]
 */
const pairGalaxies = (galaxies) => {
  const indexes = galaxies.map((g,i) => i);
  const indexSet = new Set();
  for (const i of indexes) {
    for (const j of indexes) {
      if (i === j) { continue; }
      indexSet.add(`${Math.min(i,j)}-${Math.max(i,j)}`);
    }
  }
  const pairs = [];
  indexSet.forEach(v => pairs.push(v.split('-').map(n => +n)));
  return pairs;
};

/**
 * Find [x,y] positions of all '#' chars in map
 */
const findGalaxies = (galaxyMap) => {
  const positions = [];
  for (let x=0; x < galaxyMap[0].length; x++) {
    for (let y=0; y < galaxyMap.length; y++) {
      if (galaxyMap[y][x] === '#') { positions.push([x, y]); }
    }
  }
  return positions;
};

/**
 * Find indexes of the rows and columns that contain only '.'
 *
 * Returns [ [...colIndexes], [...rowIndexes] ]
 */
const findEmpties = (galaxyMap) => {
  const [emptyCols, emptyRows] = [[], []];

  // find empty columns
  for (let x=0; x < galaxyMap[0].length; x++) {
    const col = galaxyMap.map(n => n[x]);
    if (col.every(n => n === '.')) { emptyCols.push(x); }
  }
  emptyCols.sort((a,b) => +b - +a); // sort indexes high to low

  // find empty rows
  for (let y=0; y < galaxyMap.length; y++) {
    if (galaxyMap[y].every(n => n === '.')) {
      emptyRows.push(y);
    }
  }

  return [emptyCols, emptyRows]

};

/**
 * Expand the map by adding an extra column/row after each
 * column/row containing only '.' chars
 */
const expand = (galaxyMap) => {
  const [emptyCols, emptyRows] = findEmpties(galaxyMap);
  const expanded = [];

  // build expanded map
  for (let y=0; y < galaxyMap.length; y++) {
    let expandedRow = [...galaxyMap[y]];

    // insert new cols back to front
    for (const idx of emptyCols) { expandedRow.splice(idx, 0, '.'); }

    expanded.push(expandedRow);
    if (emptyRows.includes(y)) { expanded.push(expandedRow); }
  }

  return expanded;
};

module.exports = { solve }
