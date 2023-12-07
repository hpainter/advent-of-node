/**
 * Utility methods for shared use in solution files + cli tool
 */
const { access, open, constants } = require('node:fs/promises');

/**
 * Read file contents into an array of strings.
 */
const readFile = async (path) => {
  const file = await open(path);
  const values = [];
  for await (const line of file.readLines()) {
    values.push(line);
  }
  return values;
};

/**
 * Write string to a file.
 */
const writeFile = async (contents, path) => {
  const file = await open(
    path,
    constants.O_RDWR | constants.O_CREAT | constants.O_TRUNC
  );
  await file.writeFile(contents);
};

module.exports = { readFile, writeFile };
