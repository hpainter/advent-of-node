/**
 * Advent of Code 2023 Day 8
 * https://adventofcode.com/2023/day/8
 */
const { readFile } = require('../../utils.js');

/**
 * You put your left foot in, you take your left foot out.
 */
const solve = async (partNumber=1, inputFile='./input.txt') => {
  const [turns, nodes] = parseInput(await readFile(inputFile));

  let solution;
  switch (+partNumber) {
    case 1:
      // Part 1 requests steps needed to travel from node AAA to ZZZ
      solution = stepsBetween('AAA', /ZZZ/, 0, nodes, turns);
      break;

    case 2:
      // Part 2 requests steps needed to simultaneously travel from every ..A
      // node until all paths are at ..Z nodes
      let nodesA = [...nodes.keys()].filter(p => p.endsWith('A'));

      // step count for all ..A nodes to first ..Z:
      let steps = nodesA.map(n => stepsBetween(n, /Z$/, 0, nodes, turns));

      // find lowest common multiple of all the step counts:
      solution = steps.reduce(least_common_multiple)
      break;
  }
  return solution;
};

/**
 * Not gonna lie, I stole these two nifty one liners from stack overflow
 */
const greatest_common_denom = (a, b) => a ? greatest_common_denom(b % a, a) : b;
const least_common_multiple = (a, b) => a * b / greatest_common_denom(a, b);

/**
 * Get the number of steps needed to travel from a starting node to a node that
 * matches an ending pattern.
 * 
 * @param {string} start - starting node
 * @param {RegExp} end - ending node match pattern
 * @param {integer} startTurn - turns index
 * @param {array} nodes - full node list reference
 * @param {array} turns - full turns list reference
 * @return {integer}
 */
const stepsBetween = (start, end, startTurn, nodes, turns) => {
  let [numSteps, turnIdx, position] = [0, startTurn, start];
  while (true) {
    position = nodes.get(position)[turns[turnIdx]];
    turnIdx += 1;
    numSteps += 1;
    if(position.match(end) !== null) { break; }

    // wrap back around if we run out of turns before finding a match
    if (turnIdx == turns.length) { turnIdx = 0; }
  }
  return numSteps;
};

/**
 * Parse input file into list of turns and nodes.
 *
 * turns format: ['L', 'R', ...]
 * nodes format: <Map>{'AAA': ['BBB', 'CCC'], 'BBB': ['DDD', 'EEE'], ...}
 */
const parseInput = (input) => {
  const turns = input[0].split('').map(t => t === 'L' ? 0 : 1);
  const nodes = new Map();
  input.slice(2).forEach((line) => {
    const nodeMatch = line.match(
      /([A-Z]{3})\s+=\s+\(([A-Z]{3}),\s+([A-Z]{3})\)/
    );
    nodes.set(nodeMatch[1],[nodeMatch[2], nodeMatch[3]]);
  });
  return [turns, nodes];
};

module.exports = { solve }
