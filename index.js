#!/usr/bin/env node
/**
 * CLI utility for Advent of Code JS solutions.
 */
const { program } = require('commander');
const { readFile, writeFile } = require('./utils.js')
const resultsFile = '.results';

/**
 * Command definitions
 */
program
  .name('advent')
  .description("Advent of Code 2023 CLI utility\nhttps://adventofcode.com/2023");

program
  .command('show')
  .description('Show stored solutions for all puzzles')
  .action(async () => {
    const results = await loadResults(resultsFile);
    display(results);
  });

program
  .command('check')
  .description('Run solution for an in-progress puzzle without storing result')
  .argument('[day]', 'Day number', 1)
  .argument('[part]', 'Part number', 1)
  .action(async (day, part) => {
    const result = await solvePuzzle(day, part);
    console.log(result[2]);
  });

program
  .command('solve')
  .description('Compute + save solution for a single puzzle')
  .argument('[day]', 'Day number', 1)
  .argument('[part]', 'Part number', 1)
  .action(async (day, part) => {
    const result = await solvePuzzle(day, part);
    const cache = await loadResults(resultsFile);
    cacheResult(result, cache);
    await writeFile(JSON.stringify(cache), resultsFile);
    display(cache.filter(r => r[0] === +day));
  });

program
  .command('all')
  .description('Compute + save solutions for all puzzles')
  .action(async() => {
    const cache = await loadResults(resultsFile);
    for (let day=1; day <= 25; day++) {
      for (let part=1; part <= 2; part++) {
        const result = await solvePuzzle(day, part);
        cacheResult(result, cache);
      }
    }
    await writeFile(JSON.stringify(cache), resultsFile);
    display(cache);
  });

/**
 * Runs the solve() method for a single day and puzzle part. Returns the
 * solution and the runtime, eg:
 *
 * [ 
 *   12,  // day number
 *   1,   // part number
 *   99999, // puzzle answer
 *   32     // solve() runtime in ms
 * ]
 *
 * @param {integer} day - Day number
 * @param {integer} part - Part number
 * @return {array}
 */
const solvePuzzle = async (day, part) => {
  const puzzleDir = String(day).padStart(2, '0');
  const inputPath = `./solutions/${puzzleDir}/input.txt`;
  const { solve } = require(`./solutions/${puzzleDir}/solution.js`);
  const startTime = Date.now();
  const solution = await solve(part, inputPath);
  const endTime = Date.now();
  const runtime = solution === undefined ? undefined : endTime-startTime;
  return [+day, +part, solution, runtime];
};

/**
 * Display results as a console table.
 *
 * @param {array} data - Array of solvePuzzle() results
 */
const display = (data) => {
  const formatted = {};
  data.forEach((result) => {
    dayKey = `Day ${result[0]}`;
    answerKey = `Part ${result[1]} Answer`;
    timeKey = `Part ${result[1]} Time (ms)`;
    if (!Object.keys(formatted).includes(dayKey)) {
      formatted[dayKey] = {
        'Part 1 Answer': undefined,
        'Part 1 Time (ms)': undefined,
        'Part 2 Answer': undefined,
        'Part 2 Time (ms)': undefined
      }
    }
    formatted[dayKey][answerKey] = result[2];
    formatted[dayKey][timeKey] = result[3];
  });
  console.table(formatted);
};

/**
 * Read cached results from file if it exists. Adds stubs for
 * any missing days.
 *
 * @param {string} dataFile - Stored data file path.
 * @return {array}
 */
const loadResults = async (dataFile) => {
  let results = [];
  try { 
    results = JSON.parse(await readFile(dataFile));
  } catch {
    // meh
  }
  return sortResults(results);
};

/**
 * Save a solvePuzzle() result into the cache array.
 *
 * @param {array} result - Result from solvePuzzle()
 * @param {array} cache - Results cache
 */
const cacheResult = (result, cache) => {
  let updated = false;
  for (let i=0; i < cache.length; i++) {
    if (cache[i][0] === result[0] && cache[i][1] === result[1]) {
      cache[i] = result;
      updated = true;
    }
  }
  if (!updated) { cache.push(result); }
};

/**
 * Sort result arrays by day number.
 *
 * @param {array} - Array of solvePuzzle() results
 * @return {array}
 */
const sortResults = (results) => {
  const sorted = [];
  for (let day=1; day <= 25; day++) {
    for (let part=1; part <= 2; part++) {
      const existing = results.find(r => r[0] === day && r[1] === part);
      if (existing) {
        sorted.push(existing.map(n => n === null ? undefined : n));
      } else {
        sorted.push([day, part, undefined, undefined]);
      }
    }
  }
  return sorted;
};

program.parse(process.argv);
