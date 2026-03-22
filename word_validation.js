// Word Matching Service - ASI:One
// Validate words against lists

import { WORD_LISTS } from './constants/word_lists.js';

class WordMatcher {
  constructor() {
    this.wordLists = WORD_LISTS;
  }

  validateWord(word, difficulty = 'medium') {
    const normalizedWord = this.normalizeWord(word);
    
    if (!normalizedWord) {
      return {
        isValid: false,
        reason: 'Empty word',
        word: null
      };
    }

    // Check if word matches difficulty criteria
    const difficultyRules = this.getDifficultyRules(difficulty);
    if (normalizedWord.length < difficultyRules.minLength) {
      return {
        isValid: false,
        reason: `Word too short (minimum ${difficultyRules.minLength} characters)`,
        word: normalizedWord
      };
    }

    if (normalizedWord.length > difficultyRules.maxLength) {
      return {
        isValid: false,
        reason: `Word too long (maximum ${difficultyRules.maxLength} characters)`,
        word: normalizedWord
      };
    }

    // Check if word is in any valid word list
    const isInLists = this.isWordInAnyList(normalizedWord);
    
    return {
      isValid: isInLists,
      reason: isInLists ? 'Word found in valid lists' : 'Word not in valid list',
      word: normalizedWord,
      lists: this.getMatchingLists(normalizedWord)
    };
  }

  normalizeWord(word) {
    if (!word || typeof word !== 'string') {
      return '';
    }
    return word.trim().toLowerCase();
  }

  getWordList(category) {
    return this.wordLists[category] || [];
  }

  isWordInList(word, wordList) {
    const normalizedWord = this.normalizeWord(word);
    const normalizedList = wordList.map(w => this.normalizeWord(w));
    return normalizedList.includes(normalizedWord);
  }

  isWordInAnyList(word) {
    const normalizedWord = this.normalizeWord(word);
    
    for (const category in this.wordLists) {
      if (this.wordLists[category].includes(normalizedWord)) {
        return true;
      }
    }
    return false;
  }

  getMatchingLists(word) {
    const normalizedWord = this.normalizeWord(word);
    const matchingLists = [];
    
    for (const category in this.wordLists) {
      if (this.wordLists[category].includes(normalizedWord)) {
        matchingLists.push(category);
      }
    }
    
    return matchingLists;
  }

  getDifficultyRules(difficulty) {
    const rules = {
      easy: {
        minLength: 3,
        maxLength: 6,
        complexity: 1
      },
      medium: {
        minLength: 4,
        maxLength: 10,
        complexity: 2
      },
      hard: {
        minLength: 6,
        maxLength: 15,
        complexity: 3
      }
    };
    
    return rules[difficulty] || rules.medium;
  }

  addWordToList(word, category) {
    if (!this.wordLists[category]) {
      this.wordLists[category] = [];
    }
    
    const normalizedWord = this.normalizeWord(word);
    if (!this.wordLists[category].includes(normalizedWord)) {
      this.wordLists[category].push(normalizedWord);
      return true;
    }
    return false;
  }
}

const wordMatcher = new WordMatcher();

export function validateWord(word, difficulty = 'medium') {
  return wordMatcher.validateWord(word, difficulty);
}

export function getWordList(category) {
  return wordMatcher.getWordList(category);
}

export function isWordInList(word, wordList) {
  return wordMatcher.isWordInList(word, wordList);
}

export function getMatchingLists(word) {
  return wordMatcher.getMatchingLists(word);
}

export function addWordToList(word, category) {
  return wordMatcher.addWordToList(word, category);
}

export default wordMatcher;
