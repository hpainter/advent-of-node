/**
 * Advent of Code 2023 Day 5
 * https://adventofcode.com/2023/day/5
 */
const { readFile } = require('../../utils.js');

/**
 * Feed me, Seymour!
 */
const solve = async (partNumber=1, inputFile='./input.txt') => {
  // parse input data
  const [seeds, almanac] = parseInput(await readFile(inputFile));

  let solution = null;
  switch (+partNumber) {
    case 1:
      // Part 1: seeds[] represents a flat list of IDs.
      let locations = seeds.map((seedId) => {
        // convert seed ID to location ID
        return almanacLookup(seedId, 'seed', 'location', almanac);
      });

      // solution is the minimum location number for all seed IDs
      solution = Math.min(...locations);
      break;

    case 2:
      // Part 2: seeds[] represents a set of ID ranges.
      //
      // Due to the large size of the ID ranges in the input, checking each
      // seed number individually is impractical.  But since each almanac
      // mapping covers a contiguous set of IDs on both the source and
      // destination side, we only have to look up the location numbers for the
      // first ID in each almanac entry related to a particular range of seed
      // numbers.
      let minLocation = Infinity; // minimum location ID for all seed ID ranges

      // loop over seeds array in pairs
      for (let i=0; i < (seeds.length - 2); i += 2) {
        const rangeMinId = seeds[i];              // seed ID range start value
        const rangeMaxId = seeds[i] + seeds[i+1]; // seed ID range end value
        let rangeMinLocation = Infinity;          // min location ID for current range

        // extract all almanac entries that cover the seed IDs in the current range
        const mappings = almanac.filter((mapping) => {
          if (mapping.source !== 'seed') { return false; }    // not a seed entry
          if (mapping.lastId < rangeMinId) { return false; }  // outside low
          if (mapping.firstId > rangeMaxId) { return false; } // outside high
          return true;
        });

        // find the minimum location for the initial seed IDs in each relevant almanac entry
        mappings.forEach((mapping) => {
          // seed ID to look up; accounts for mappings that start prior to our range minimum
          const seedId = Math.max(mapping.firstId, rangeMinId);

          // location ID
          const seedLocation = almanacLookup(seedId, 'seed', 'location', almanac);

          // update range minimum
          if (seedLocation < rangeMinLocation) { rangeMinLocation = seedLocation; }
        });

        // update global minimum
        if (rangeMinLocation < minLocation) { minLocation = rangeMinLocation; }
      }

      solution = minLocation;
      break;
  }
  return solution;
};

/**
 * Convert puzzle input into a set of seed numbers and a list of almanac mappings.
 * Parsed data returned as [seeds, almanac] where seeds is an integer array and almanac is
 * an array of mapping objects.
 *
 * Mapping object format:
 *
 * {
 *   source:      'seed',  // type of ID mapping converts from
 *   destination: 'soil',  // type of ID mapping converts to
 *   firstId:     123,     // lowest ID covered by mapping
 *   lastId:      456,     // highest ID covered by mapping
 *   offset:      -10      // offset translating source ID into destination ID
 * }
 *
 * Eg, this maps a seed ID of 201 to a soil ID of 191.
 */
const parseInput = (input) => {
  const [seeds, almanac] = [[],[]];          // output arrays
  let [sourceType, destType] = [null, null]; // tracking vars for item type headers

  for (const line of input) {
    // detect seed numbers line
    const seedsMatch = line.match(/^seeds\s*:(.*)$/i);
    if (seedsMatch !== null) {
      const seedValues = seedsMatch[1].trim().split(/\s+/).map(n => +n);
      seeds.push(...seedValues);
      continue;
    }

    // detect item type header line
    const headerMatch = line.match(/^(.*?)-to-(.*?)\s+map:/i);
    if (headerMatch !== null) {
      // set running source and destination types
      sourceType = headerMatch[1];
      destType = headerMatch[2];
      continue;
    }

    // skip blank lines
    if (line.match(/[^\s]/) === null) { 
      // skip blank lines
      continue;
    }

    // only mapping lines remain
    const mapValues = line.split(/\s+/).map(n => +n);
    almanac.push({
      source:      sourceType,
      destination: destType,
      firstId:     mapValues[1],
      lastId:      mapValues[1] + mapValues[2] - 1,
      offset:      mapValues[0] - mapValues[1]
    });
  }
  return [seeds, almanac];
}

/**
 * Convert a single ID for sourceType into an ID for destType using almanac mappings.
 *
 * Params:
 *   - sourceId:   integer
 *   - sourceType: string ('seed', 'soil', 'water', etc)
 *   - destType:   string ('seed', 'soil', 'water', etc)
 *   - almanac:    mappings array of all ID types
 */
const almanacLookup = (sourceId, sourceType, destType, almanac) => {
  let [itemType, itemId] = [sourceType, sourceId];

  while (itemType !== destType) {
    let [mapFound, nextType] = [false, null];

    for (const mapping of almanac) {
      // validate that mapping type applies to this itemId
      if (mapping.source !== itemType){ continue; }

      // hang on to the next linked type in case we don't find a mapping
      nextType = mapping.destination;

      // check if mapping ID range covers itemId
      if (mapping.firstId <= itemId && itemId <= mapping.lastId) {
        mapFound = true;
        itemType = mapping.destination;   // next linked type
        itemId = itemId + mapping.offset; // transform itemId for next type
        break;
      }
    };

    if (!mapFound) {
      // if current itemId was not covered by any almanac entry it remains
      // unchanged for the next type
      itemType = nextType;
    }
  }

  return itemId;
};

module.exports = { solve }
