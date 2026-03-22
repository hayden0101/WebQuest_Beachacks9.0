// Scoring Service - ASI:One
// Complexity-based scoring algorithm

import { SCORING_RULES } from './constants/scoring_rules.js';

class ScoringService {
  constructor() {
    this.rules = SCORING_RULES;
  }

  calculateScore(word) {
    if (!word || typeof word !== 'string') {
      return { totalScore: 0, breakdown: [] };
    }

    const breakdown = [];
    let totalScore = 0;

    // 1. Length-based scoring
    const lengthScore = this.calculateLengthScore(word);
    breakdown.push({ type: 'length', score: lengthScore, description: 'Word length' });
    totalScore += lengthScore;

    // 2. Complexity-based scoring
    const complexityScore = this.calculateComplexityScore(word);
    breakdown.push({ type: 'complexity', score: complexityScore, description: 'Letter complexity' });
    totalScore += complexityScore;

    // 3. Uniqueness bonus
    const uniquenessScore = this.calculateUniquenessScore(word);
    breakdown.push({ type: 'uniqueness', score: uniquenessScore, description: 'Unique letters' });
    totalScore += uniquenessScore;

    // 4. Bonus for rare patterns (palindromes, double letters, etc.)
    const patternBonus = this.calculatePatternBonus(word);
    if (patternBonus > 0) {
      breakdown.push({ type: 'pattern', score: patternBonus, description: 'Special patterns' });
      totalScore += patternBonus;
    }

    // Cap minimum score
    totalScore = Math.max(this.rules.minScore, totalScore);
    // Cap maximum score
    totalScore = Math.min(this.rules.maxScore, totalScore);

    return {
      totalScore,
      breakdown,
      word: word
    };
  }

  getScoreBreakdown(word) {
    return this.calculateScore(word);
  }

  adjustScoreForTime(score, timeTaken) {
    if (!score || isNaN(timeTaken)) {
      return score;
    }

    const timeBonus = this.calculateTimeBonus(timeTaken);
    const adjustedScore = score + timeBonus;

    return Math.max(this.rules.minScore, Math.min(this.rules.maxScore, adjustedScore));
  }

  calculateLengthScore(word) {
    const baseScore = this.rules.basePoints;
    const perLetterBonus = this.rules.pointsPerLetter;
    
    return baseScore + (word.length * perLetterBonus);
  }

  calculateComplexityScore(word) {
    let complexityScore = 0;
    
    word.split('').forEach(letter => {
      if (this.rules.complexityWeights[letter]) {
        complexityScore += this.rules.complexityWeights[letter];
      }
    });

    return complexityScore;
  }

  calculateUniquenessScore(word) {
    const uniqueLetters = new Set(word.toLowerCase()).size;
    const totalLetters = word.length;
    
    if (totalLetters === 0) return 0;

    const uniquenessRatio = uniqueLetters / totalLetters;
    return Math.round(uniquenessRatio * this.rules.uniquenessBonus);
  }

  calculatePatternBonus(word) {
    const lowerWord = word.toLowerCase();
    let bonus = 0;

    // Palindrome bonus
    if (this.isPalindrome(lowerWord)) {
      bonus += this.rules.bonusScores.palindrome;
    }

    // Double letters bonus
    if (this.hasDoubleLetters(lowerWord)) {
      bonus += this.rules.bonusScores.doubleLetters;
    }

    // All vowels bonus
    if (this.isAllVowels(lowerWord)) {
      bonus += this.rules.bonusScores.allVowels;
    }

    // All consonants bonus
    if (this.isAllConsonants(lowerWord)) {
      bonus += this.rules.bonusScores.allConsonants;
    }

    return bonus;
  }

  calculateTimeBonus(timeTaken) {
    const maxBonus = this.rules.maxTimeBonus;
    const minResponseTime = this.rules.minResponseTime;
    const maxResponseTime = this.rules.maxResponseTime;

    if (timeTaken < minResponseTime) {
      // Bonus for fast response
      const bonusMultiplier = 1 - (timeTaken / minResponseTime);
      return Math.round(maxBonus * bonusMultiplier);
    }

    if (timeTaken > maxResponseTime) {
      // Penalty for slow response
      const penaltyMultiplier = (timeTaken - maxResponseTime) / maxResponseTime;
      return -Math.round(maxBonus * penaltyMultiplier);
    }

    return 0;
  }

  isPalindrome(word) {
    return word === word.split('').reverse().join('');
  }

  hasDoubleLetters(word) {
    for (let i = 0; i < word.length - 1; i++) {
      if (word[i] === word[i + 1]) {
        return true;
      }
    }
    return false;
  }

  isAllVowels(word) {
    const vowels = 'aeiou';
    return word.split('').every(letter => vowels.includes(letter));
  }

  isAllConsonants(word) {
    const vowels = 'aeiou';
    return word.split('').every(letter => !vowels.includes(letter));
  }
}

const scoringService = new ScoringService();

export function calculateScore(word) {
  return scoringService.calculateScore(word);
}

export function getScoreBreakdown(word) {
  return scoringService.getScoreBreakdown(word);
}

export function adjustScoreForTime(score, time) {
  return scoringService.adjustScoreForTime(score, time);
}

export default scoringService;
