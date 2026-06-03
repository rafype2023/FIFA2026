import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateR32 } from './fifaRules.js';

// Resolve current directory for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const matrixPath = path.resolve(__dirname, '../../../FIFA_Matrix.json');
const matrix = JSON.parse(fs.readFileSync(matrixPath, 'utf8'));

console.log(`Starting FIFA 2026 Round of 32 Integration Test...`);
console.log(`Loaded ${matrix.length} scenarios from FIFA_Matrix.json\n`);

// Standard picks generator
const generatePicks = () => {
  const picks = {};
  const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  groups.forEach(g => {
    picks[g] = [
      `Team_${g}_1`, // Winner
      `Team_${g}_2`, // Runner-up
      `Team_${g}_3`, // 3rd Place
      `Team_${g}_4`  // 4th Place
    ];
  });
  return picks;
};

// Helper maps
const mapWinnerKey = (key) => {
  const match = key.match(/Winner_Group_([A-L])/);
  return match ? `1${match[1]}` : key;
};

const mapThirdKey = (val) => {
  const match = val.match(/3rd_Group_([A-L])/);
  return match ? match[1] : val;
};

// Hardcoded non-third place match definitions to verify general correctness of the bracket
const nonThirdMatchups = {
  "M73": { team1: "Team_A_2", team2: "Team_B_2" },
  "M75": { team1: "Team_F_1", team2: "Team_C_2" },
  "M76": { team1: "Team_C_1", team2: "Team_F_2" },
  "M78": { team1: "Team_E_2", team2: "Team_I_2" },
  "M83": { team1: "Team_K_2", team2: "Team_L_2" },
  "M84": { team1: "Team_H_1", team2: "Team_J_2" },
  "M86": { team1: "Team_J_1", team2: "Team_H_2" },
  "M88": { team1: "Team_D_2", team2: "Team_G_2" }
};

let passedScenarios = 0;
let failedScenarios = 0;

for (const scenario of matrix) {
  const code = scenario.advancing_thirds;
  const picks = generatePicks();
  
  // Construct thirdPlaces array based on advancing thirds combination
  const thirdPlaces = code.split('').map(g => `Team_${g}_3`);
  
  let matchesOutput;
  try {
    matchesOutput = generateR32(picks, thirdPlaces);
  } catch (err) {
    console.error(`❌ Scenario ${code} failed to execute generateR32:`, err.message);
    failedScenarios++;
    continue;
  }
  
  let scenarioPassed = true;
  const mismatchDetails = [];
  
  // 1. Verify that matchesOutput has exactly 16 matches
  if (matchesOutput.length !== 16) {
    scenarioPassed = false;
    mismatchDetails.push(`Expected 16 matches, got ${matchesOutput.length}`);
  }
  
  // 2. Verify non-third place matchups
  for (const [matchId, expected] of Object.entries(nonThirdMatchups)) {
    const match = matchesOutput.find(m => m.id === matchId);
    if (!match) {
      scenarioPassed = false;
      mismatchDetails.push(`Match ${matchId} is missing in output`);
      continue;
    }
    if (match.team1 !== expected.team1 || match.team2 !== expected.team2) {
      scenarioPassed = false;
      mismatchDetails.push(`Match ${matchId} mismatch: Expected ${expected.team1} vs ${expected.team2}, got ${match.team1} vs ${match.team2}`);
    }
  }
  
  // 3. Verify third-place matchups mapping against FIFA_Matrix.json
  for (const [winKey, thirdVal] of Object.entries(scenario.matchups)) {
    const winnerGroupLetter = winKey.split('_')[2]; // e.g. "Winner_Group_E" -> "E"
    const thirdGroupLetter = mapThirdKey(thirdVal); // e.g. "3rd_Group_A" -> "A"
    
    const expectedWinnerTeam = `Team_${winnerGroupLetter}_1`;
    const expectedThirdTeam = `Team_${thirdGroupLetter}_3`;
    
    // Find match with this winner
    const match = matchesOutput.find(m => m.team1 === expectedWinnerTeam);
    
    if (!match) {
      scenarioPassed = false;
      mismatchDetails.push(`Could not find matchup for winner of Group ${winnerGroupLetter} (Expected winner: ${expectedWinnerTeam})`);
      continue;
    }
    
    if (match.team2 !== expectedThirdTeam) {
      scenarioPassed = false;
      mismatchDetails.push(`Matchup mismatch for Winner Group ${winnerGroupLetter}: Expected opponent ${expectedThirdTeam}, got ${match.team2}`);
    }
  }
  
  if (scenarioPassed) {
    passedScenarios++;
  } else {
    failedScenarios++;
    console.error(`❌ Mismatch in scenario ${code}:`);
    mismatchDetails.forEach(detail => console.error(`  - ${detail}`));
  }
}

console.log(`\n========================================`);
console.log(`  INTEGRATION TEST SUMMARY`);
console.log(`========================================`);
console.log(`Total Scenarios: ${matrix.length}`);
console.log(`Passed:          ${passedScenarios}`);
console.log(`Failed:          ${failedScenarios}`);
console.log(`========================================`);

if (failedScenarios > 0) {
  console.error(`\n🔴 Test Failed: There are ${failedScenarios} failing combinations.`);
  process.exit(1);
} else {
  console.log(`\n🟢 Test Passed: All 495 combinations match perfectly!`);
}
