import { filterMessage, isSafe } from './AI_Integration/filters.js';
import { WORD_LISTS } from './AI_Integration/constants/word_lists.js';
import { SCORING_RULES } from './AI_Integration/constants/scoring_rules.js';

console.log('--- Filters ---');
console.log('filterMessage("hello"):', filterMessage('hello'));
console.log('isSafe("hello"):', isSafe('hello'));

console.log('\n--- Word Lists ---');
console.log('categories:', Object.keys(WORD_LISTS));
console.log('foods sample:', WORD_LISTS.foods?.slice(0, 8));

console.log('\n--- Scoring Rules ---');
console.log('basePoints:', SCORING_RULES.basePoints);
console.log('pointsPerLetter:', SCORING_RULES.pointsPerLetter);
console.log('complexity q,z:', SCORING_RULES.complexityWeights.q, SCORING_RULES.complexityWeights.z);

console.log('\nRun: node .\\test_all.mjs from project root to execute these checks.');
