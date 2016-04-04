
// Validate the performance configuration.
export default function validator (config) {

  let groups = config.groups;

  // ensure each group has the same number of sections
  groups.reduce((length, g, i) => {
    let currentLength = g.sections.length;
    if (length !== currentLength) throw new Error(''
      + 'Group ' + i + ' has ' + currentLength + ' sections defined, '
      + 'expected ' + length + ' sections');
    return length;
  }, groups[0].sections.length);

  // ensure each section has the same number of sequences
  let sequenceLengths = groups.map(g => g.sections.map(s => s.sequences.length));
  sequenceLengths.reduce((prev, curr, i) => {
    if (JSON.stringify(prev) !== JSON.stringify(curr)) throw new Error(''
      + 'Group ' + i + ' sequences do not match the previous group\'s.');
    return curr;
  }, sequenceLengths[0]);

  // ensure sequence timings are the same across all groups
  let timings = groups.map(g => g.sections.map(s => s.timings));
  timings.reduce((prev, curr, i) => {
    if (JSON.stringify(prev) !== JSON.stringify(curr)) throw new Error(''
      + 'Group ' + i + ' sequence timings do not match the previous group\'s');
    return curr;
  }, timings[0]);
}
