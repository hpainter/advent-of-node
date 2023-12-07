/**
 * Advent of Code 2023 Day 4
 * https://adventofcode.com/2023/day/4
 */
const { readFile } = require('../../utils.js');

/**
 * gambling problem?  call 1-800-JACKPOT
 */
const solve = async (partNumber=1, inputFile='./input.txt') => {
  // Parse input into cards, each card represented as a pair of integer arrays
  const cards = (await readFile(inputFile)).map(parseCard);

  let solution = null;
  switch (+partNumber) {
    case 1:
      // Part 1 requests sum of the card scores
      const cardPoints = cards.map(computePoints);
      solution = cardPoints.reduce((total, x) => total + x, 0);
      break;
    case 2:
      // Part 2 requests total number of cards including copies

      // Number of matches for each card
      const cardMatches = cards.map(c => findMatches(c).length);

      // Number of copies of each card
      const copyCounts = new Array(cards.length).fill(0).map(
        (count, idx) => recursiveCopyCounts(count, idx, cardMatches)
      );

      solution = copyCounts.reduce((total, x) => total + x, 0);
      break;
  }
  return solution;
};

/**
 * Implements the problem's 'card copies' logic.  For each original card you
 * receive one copy of each subsequent card up to the number of matches in the
 * original.  Recursively apply this to each copy received, and return the
 * total number of cards (original plus all copies) that result from a single
 * card.
 *
 * Params:
 *   - numCards:    total card count accumulator, initialize with 0
 *   - cardIdx:     matchCounts[] index of card to generate counts for
 *   - matchCounts: array containing number of matches for all cards
 */
const recursiveCopyCounts = (numCards, cardIdx, matchCounts) => {
  numCards += 1; // one card for ourself

  // add cards resulting from subsequent cards up to our match count
  for (let i=1; i <= matchCounts[cardIdx]; i++) {
    numCards += recursiveCopyCounts(0, cardIdx + i, matchCounts);
  }

  return numCards;
};

/**
 * Parse input line into 2 integer lists.
 *
 * Example:
 *   cardStr: 'Card 1: 41 48 83 86 | 83 86  6'
 *   returns: [ [41, 48, 83, 86], [83, 86, 6] ]
 */
const parseCard = (cardStr) => {
  // discard 'Card 1:' portion, separate remaining string on '|'
  const parsed = cardStr.match(/^.*:\s+(.*?)\s+\|\s+(.*?)$/);

  // split number strings on spaces
  // (mind that multiple spaces do not become 0s)
  const listA = parsed[1].trim().split(/\s+/).map(n => +n);
  const listB = parsed[2].trim().split(/\s+/).map(n => +n);

  return [listA, listB];
};

/**
 * Find unique matching numbers for a single card.
 *
 * Example:
 *   card:    [ [41, 48, 83, 86], [83, 86, 6] ]
 *   returns: [83, 86]
 */
const findMatches = (card) => {
  // find numbers from second list contained in first list
  // (unique matches only via Set)
  let matches = new Set(card[1].filter(x => card[0].includes(x)));

  // convert set back to array before return
  return [...matches];
};

/**
 * Calculate point value of a card.  Points are defined as the count of unique
 * matching numbers in the second card as a power of two.
 */
const computePoints = (card) => {
  // determine matching numbers
  const winners = findMatches(card);

  // get points value: 2^(num_matches - 1)
  // note that the Math.floor is added to handle the special case of 0 matches,
  // since 2^-1 = 0.5
  return Math.floor(Math.pow(2, winners.length - 1));
};

module.exports = { solve }
