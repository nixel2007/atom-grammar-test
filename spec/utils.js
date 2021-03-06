'use babel';

import path from 'path';


export function fixtureFilename(filename) {
  return path.join('spec', 'fixtures', filename);
}


function* _lines(...lines) {
  for (const line of lines) {
    yield line;
  }
}


export function lineFixture(filename, ...lines) {
  const iterator = _lines(...lines);
  iterator.filename = filename;
  return iterator;
}


export function parsedLineFixture(filename, ...lines) {
  const parsedLines = lines.map(
    (line, index) => {  // eslint-disable-line arrow-body-style
      return { line, lineNumber: index + 1 };
    }
  );
  return lineFixture(filename, ...parsedLines);
}
