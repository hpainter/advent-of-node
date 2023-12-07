## Advent of Node(.js)

JS solutions for (Advent of Code 2023)[https://adventofcode.com/2023] puzzles.  Includes a small CLI utility for running and displaying solutions.  Built with Node.js v20.10.0, which is set in an `.nvmrc` for use with `nvm use`.

- Separate directories for each day number are under `solutions/` and contain the problem description, input data and the implemented solution.  Day number `00` contains a set of template files.
- Each solution exports a single `solve()` method that expects to receive arguments for the part number (`1` or `2`) and path to the file containing the input data.  `solve` should return the bare answer for that puzzle.
- Each solution imports a single `readFile` method from `utils.js` that reads an input file into an array of strings.
- The CLI utility defined in `index.js` wraps all this up so you can just do `npm exec advent solve 11 2` eg.

### CLI tool notes

- `npm install` to install the lone dependency for the CLI tool ((commander)[https://github.com/tj/commander.js#readme]
- `npm exec advent` to display CLI tool help/commands

