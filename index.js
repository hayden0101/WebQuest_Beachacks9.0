// AI Integration Module 
// Main export file for all AI functionality

export * from './speech_service.js';
export * from './word_matcher.js';
export * from './scoring.js';
export * from './filters.js';

export default {
  speech: {
    startListening: (callback) => import('./speech_service.js').then(m => m.startListening(callback)),
    stopListening: () => import('./speech_service.js').then(m => m.stopListening()),
    getTranscript: () => import('./speech_service.js').then(m => m.getTranscript())
  },
  wordMatcher: {
    validateWord: (word, difficulty) => import('./word_matcher.js').then(m => m.validateWord(word, difficulty)),
    getWordList: (category) => import('./word_matcher.js').then(m => m.getWordList(category)),
    isWordInList: (word, wordList) => import('./word_matcher.js').then(m => m.isWordInList(word, wordList))
  },
  scoring: {
    calculateScore: (word) => import('./scoring.js').then(m => m.calculateScore(word)),
    getScoreBreakdown: (word) => import('./scoring.js').then(m => m.getScoreBreakdown(word)),
    adjustScoreForTime: (score, time) => import('./scoring.js').then(m => m.adjustScoreForTime(score, time))
  },
  filters: {
    filterMessage: (text) => import('./filters.js').then(m => m.filterMessage(text)),
    isSafe: (text) => import('./filters.js').then(m => m.isSafe(text)),
    getFilteredWord: (text) => import('./filters.js').then(m => m.getFilteredWord(text))
  }
};