const fs = require('fs');

const input = fs.readFileSync('full_pdf.txt', 'utf8');
const lines = input.split('\n');

const combinations = {};
const targetWinners = ["1A", "1B", "1D", "1E", "1G", "1I", "1K", "1L"];

let count = 0;

for (let i = 0; i < lines.length; i++) {
  let line = lines[i].trim();
  
  // extract all tokens that look like 3X (e.g. 3A, 3B, ..., 3L)
  const matches = line.match(/\b3[A-L]\b/g);
  if (matches && matches.length === 8) {
    const opponents = matches.map(m => m.replace('3', ''));
    const sortedGroups = [...opponents].sort().join('');
    
    const mapping = {};
    for(let j = 0; j < 8; j++) {
      mapping[targetWinners[j]] = opponents[j];
    }
    
    combinations[sortedGroups] = mapping;
    count++;
  }
}

const outputFile = `
export const ANNEXE_C = ${JSON.stringify(combinations, null, 2)};

export const M73_M88_MATCHUPS = [
  { id: "M73", teamA: "2A", teamB: "2B" },
  { id: "M74", teamA: "1E", teamB: "3_ABCDF" },
  { id: "M75", teamA: "1F", teamB: "2C" },
  { id: "M76", teamA: "1C", teamB: "2F" },
  { id: "M77", teamA: "1I", teamB: "3_CDFGH" },
  { id: "M78", teamA: "2E", teamB: "2I" },
  { id: "M79", teamA: "1A", teamB: "3_CEFHI" },
  { id: "M80", teamA: "1L", teamB: "3_EHIJK" },
  { id: "M81", teamA: "1D", teamB: "3_BEFIJ" },
  { id: "M82", teamA: "1G", teamB: "3_AEHIJ" },
  { id: "M83", teamA: "2K", teamB: "2L" },
  { id: "M84", teamA: "1H", teamB: "2J" },
  { id: "M85", teamA: "1B", teamB: "3_EFGIJ" },
  { id: "M86", teamA: "1J", teamB: "2H" },
  { id: "M87", teamA: "1K", teamB: "3_DEIJL" },
  { id: "M88", teamA: "2D", teamB: "2G" }
];
`;

fs.writeFileSync('src/lib/fifaRules.js', outputFile);
console.log(`Successfully parsed ${count} lines yielding ${Object.keys(combinations).length} unique combinations`);
