/**
 * Advent of Code 2023 Day 2
 * https://adventofcode.com/2023/day/2
 */
const { readFile } = require('../../utils.js');

// 246 toothpicks
const solve = async (partNumber=1, inputFile='./input.txt') => {
  const input = await readFile(inputFile);
  const gameLog = input.map(parseGameResults);
  let solution = null;
  switch (+partNumber) {
    case 1:
      // Part 1 requests the sum of all valid game IDs
      const colorLimits = [12, 13, 14]; // max color counts
      const validGames = [];            // valid game IDs
      gameLog.forEach((log) => {
        if (isValidGame(log.results, colorLimits)) {
          validGames.push(log.id)
        }
      });
      solution = validGames.reduce((total, x) => total + x, 0);
      break;

    case 2:
      // Part 2 requests the sum of all game power values
      const gamePowers = gameLog.map(log => computeGamePower(log.results));
      solution = gamePowers.reduce((total, x) => total + x, 0);
      break;
  }
  return solution;
};

/**
 * Map color names to array indexes
 */
const colorMap = ['red', 'green', 'blue'];

/**
 * Converts log entry for a single game into a game ID number and a 2D array of
 * color counts for each round played.
 *
 * Example:
 *   game = 'Game 75: 8 green, 1 red; 3 blue, 1 red, 5 green; 12 green'
 *   return = {
 *     id: 75,        // game id
 *     results: [
 *       [1, 8, 0],   // round 1 result (1 red, 8 green, 0 blue)
 *       [1, 5, 3],   // round 2 result
 *       [0, 12, 0]   // round 3 result
 *     ]
 *   }
 */
const parseGameResults = (game) => {
  // extract ID from game log
  const id = +game.match(/Game\s+(\d+):/)[1];

  // extract full results string from game log
  const resultsLog = game.match(/:\s+(.*)$/)[1];

  // parse results log string into collection of color counts per round
  const parsedResults = [];
  resultsLog.split(';').forEach( (roundLog) => { // eg '8 green, 1 red'
    const result = [0, 0, 0]; // single round result

    roundLog.split(',').forEach( (colorLog) => { // eg ' 1 red'
      const colorMatch = colorLog.trim().match(/(\d+)\s+(red|green|blue)/);

      // extract count for current color
      const colorCount = +colorMatch[1];

      // find result[] column index for current color
      const colorIdx = colorMap.indexOf(colorMatch[2]);

      result[colorIdx] = colorCount;
    });
    parsedResults.push(result);
  });
  return {id, results: parsedResults};
};

/**
 * Determine if parsedResults array represents a valid game based on
 * the per-color limitation values in gameLimits.
 */
const isValidGame = (parsedResults, gameLimits) => {
  return parsedResults.every((result) => {
    return result.every((count, idx) => count <= gameLimits[idx]);
  });
};

/**
 * Calculate 'power' value of a game, defined as the result of multiplying the
 * maximum value in each parsedResults array column.  These would represent the
 * minimum number of cubes of each color needed to generate the result set.
 *
 * Example:
 *   [ [1,2,3], [4,0,2] ] => (4*2*3) => 24
 */
const computeGamePower = (parsedResults) => {
  // minimum per-color counts needed to support parsedResults
  const colorMins = [0, 0, 0];
  for (let i=0; i < colorMins.length; i++) {
    colorMins[i] = parsedResults.map(r => r[i])
                                .sort((a,b) => a - b)
                                .pop();
  }
  return colorMins.reduce((total, x) => total * x, 1);
};

module.exports = { solve }
