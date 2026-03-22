// Scoring Rules 
// Configuration for scoring algorithm

export const SCORING_RULES = {
  // Base points for any valid word
  minScore: 10,
  maxScore: 200,
  basePoints: 10,
  
  // Points per letter
  pointsPerLetter: 3,
  
  // Complexity weights for letters (more complex letters = more points)
  complexityWeights: {
    'a': 1, 'e': 1, 'i': 1, 'o': 1, 'u': 1,      // Vowels (simplest)
    'l': 1, 'n': 1, 'r': 1, 's': 1, 't': 1,      // Simple consonants
    'b': 2, 'c': 2, 'd': 2, 'f': 2, 'g': 2, 'h': 2, 'j': 2, 'k': 2, 'm': 2, 'p': 2,
    'q': 3, 'v': 3, 'w': 3, 'x': 4, 'y': 3, 'z': 4  // Rare/complex letters
  },
  
  // Bonus for having unique letters
  uniquenessBonus: 15,
  
  // Time-based scoring
  minResponseTime: 2000,   // 2 seconds = maximum bonus
  maxResponseTime: 30000,  // 30 seconds = start penalty
  maxTimeBonus: 30,        // Maximum bonus/penalty from time
  
  // Bonus scores for special patterns
  bonusScores: {
    palindrome: 20,        // Word reads same backwards (e.g., "radar")
    doubleLetters: 10,     // Has double letters (e.g., "happy")
    allVowels: 15,         // All vowel word (e.g., "aeiou" - rare)
    allConsonants: 10      // All consonant word (e.g., "crypt")
  }
};
