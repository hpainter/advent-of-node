/**
 * Advent of Code 2023 Day 6
 * https://adventofcode.com/2023/day/6
 */
const { readFile } = require('../../utils.js');

/**
 * 🎹 Chariots of Fire theme plays softly in background 🎹
 */
const solve = async (partNumber=1, inputFile='./input.txt') => {
  const races = parseInput(await readFile(inputFile));
  let solution = null;
  switch (+partNumber) {
    case 1:
      // Part 1 requests product of winning options for multiple races
      solution = races.map(countWins).reduce((total, x) => total * x, 1);
      break;

    case 2:
      // Part 2 requests count of winning options for a single long race
      const time = +races.map(r => r[0]).join('');
      const distance = +races.map(r => r[1]).join('');
      solution = countWins([time,distance]);
      break;
  }
  return solution;
};

/**
 * Find the number of number of possible velocities in a single race that
 * result in a winning distance.
 */
const countWins = (race) => {
  const [time, distance] = race;
  let count = 0;
  for(let i=1; i < time-1; i++) {
    if (i * (time - i) > distance) { count += 1; }
  }
  return count;
};

/**
 * Parse puzzle input
 */
const parseInput = (input) => {
  const [times, distances] = [[],[]];
  for (const line of input) {
    // detect times line
    const timesMatch = line.match(/^Time:(.*)$/i);
    if (timesMatch !== null) {
      const timeValues = timesMatch[1].trim().split(/\s+/).map(n => +n);
      times.push(...timeValues);
      continue;
    }

    // detect distances line
    const distanceMatch = line.match(/^Distance:(.*)$/i);
    if (distanceMatch !== null) {
      const distanceValues = distanceMatch[1].trim().split(/\s+/).map(n => +n);
      distances.push(...distanceValues);
      continue;
    }
  }
  return times.map((t,idx) => [times[idx], distances[idx]])
}

module.exports = { solve }
