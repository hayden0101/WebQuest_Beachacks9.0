# AI Integration Module - ASI:One

A complete AI-powered speech recognition and word validation system for your web game.

## Features

**Speech Recognition** - Web Speech API for voice input
**Word Matching** - Validate words against multiple categories
**Scoring Algorithm** - Complexity-based scoring system
**NSFW Filtering** - Automatic content filtering
**Game Ready** - Plug directly into your HTML/JS frontend

## Installation

### 1. Copy the ai-integration folder to your project

### 2. Import the module

```javascript
// Import all functionality
import { startListening, calculateScore, filterMessage, validateWord } from './ai-integration/index.js';

// Or import specific services
import { startListening } from './ai-integration/speech_service.js';
import { calculateScore } from './ai-integration/scoring.js';
