/**
 * Advent of Code 2023 Day 7
 * https://adventofcode.com/2023/day/7
 */
const { readFile } = require('../../utils.js');

// card ranking styles
const cardRankings = {
  standard: '23456789TJQKA'.split(''),
  jokersWild: 'J23456789TQKA'.split('')
};

// set default effective card ranking
let cardRank = cardRankings.standard;

// set default effective wildcard
let wildCard = null;

/**
 * There'll be time enough for counting when the dealings done.
 */
const solve = async (partNumber=1, inputFile='./input.txt') => {
  // convert input into [cards, bet] string pairs, eg:
  // [ ['AAK78', '991], ['33222', '101'], ... ]
  const hands = (await readFile(inputFile)).map(i => i.split(' '));

  switch (+partNumber) {
    case 1:
      // Part 1 has no wild cards
      cardRank = cardRankings.standard;
      wildCard = null;
      break;

    case 2:
      // Part 2 replaces jacks with jokers
      cardRank = cardRankings.jokersWild;
      wildCard = 'J';
      break;
  }

  // rank all the hands
  const rankedHands = hands.map(bestWildcardHand).sort(compareHands);

  // compute winnings based on hand ranking
  const solution = rankedHands.reduce((total, hand, idx) => {
    return total += +hand[1] * (idx+1);
  }, 0);

  return solution;
};

/**
 * Determine best version of a hand considering the scoped value of wildCard.
 * Return value will have three elements, with the third being the original
 * card set. Eg:
 *
 * bestWildCardHand(['JAAA4', '99']) => ['AAAA4', 99', 'JAAA4']
 */
const bestWildcardHand = (hand) => {
  // generate all possible wildcard permutations
  possibleHands = [];
  cardRank.forEach((card) => {
    const newCards = hand[0].replaceAll(wildCard, card);
    possibleHands.push([newCards, hand[1]]);
  });

  // rank our options and choose the best one
  const bestHand = possibleHands.sort(compareHands).pop();

  // add the original cards back in
  if (bestHand.length < 3) {
    bestHand.push(hand[0]);
  } else {
    bestHand[2] = hand[0];
  }

  return bestHand;
};

/**
 * Sort function for hands using scoped value of cardRank.  Handles
 * both two-element standard hands and three-element wildcard hands.
 */
const compareHands = (a, b) => {
  // 1. Lower unique card count always wins
  // - four of a kind (2 unique) < three of a kind (3 unique)
  const [setA, setB] = [new Set(a[0]), new Set(b[0])];
  if (setA.size < setB.size) { return 1; }
  if (setA.size > setB.size) { return -1; }

  // 2. Max repeated card count wins
  //    - four of a kind (4,1) > full house (3,2)
  //    - three of a kind (3,1,1) > two pair (2,2,1)
  let [maxRepeatA, maxRepeatB] = [0, 0];
  setA.forEach((card) => {
    reps = a[0].split('').filter(c => c === card).length;
    if (reps > maxRepeatA) { maxRepeatA = reps; }
  });
  setB.forEach((card) => {
    reps = b[0].split('').filter(c => c === card).length;
    if (reps > maxRepeatB) { maxRepeatB = reps; }
  });
  if (maxRepeatA > maxRepeatB) { return 1; }
  if (maxRepeatA < maxRepeatB) { return -1; }

  // 3. Check first high card, ignoring any wildcard replacements
  for (let i=0; i < 5; i++) {
    // if wildcards were applied, original cards should be at end
    cardsA = a.length > 2 ? a[2] : a[0];
    cardsB = b.length > 2 ? b[2] : b[0];
    rankA = cardRank.indexOf(cardsA.charAt(i));
    rankB = cardRank.indexOf(cardsB.charAt(i));
    if (rankA > rankB) { return 1; }
    if (rankA < rankB) { return -1; }
  }

  // 4. Same hands.
  return 0;
};

module.exports = { solve }
