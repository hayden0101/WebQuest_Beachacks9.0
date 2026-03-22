// Frontend Integration - ASI:One
// Example of how to use the AI module in your game

import { startListening, stopListening, getTranscript } from '../ai-integration/index.js';
import { calculateScore } from '../ai-integration/index.js';
import { filterMessage } from '../ai-integration/index.js';
import { validateWord } from '../ai-integration/index.js';

class GameIntegration {
  constructor() {
    this.isListening = false;
    this.gameState = {
      currentWord: '',
      score: 0,
      timeRemaining: 60
    };
  }

  async startListening() {
    this.isListening = await startListening({
      onResult: (result) => {
        console.log('Speech result:', result);
        
        if (result.final) {
          this.handleSpeechResult(result.final);
        } else {
          // Show interim results
          this.updateInterimDisplay(result.interim);
        }
      },
      onError: (error) => {
        console.error('Speech error:', error);
        this.showError(error);
      },
      onEnd: (transcript) => {
        console.log('Speech ended, final transcript:', transcript);
        this.isListening = false;
        this.updateMicButton(false);
      }
    });

    if (this.isListening) {
      this.updateMicButton(true);
      console.log('Started listening...');
    } else {
      this.showError('Failed to start listening');
    }
  }

  async stopListening() {
    const stopped = await stopListening();
    this.isListening = false;
    this.updateMicButton(false);
    console.log('Stopped listening');
    return stopped;
  }

  handleSpeechResult(transcript) {
    // Filter the text
    const { filteredText, wasFiltered } = filterMessage(transcript);
    
    if (wasFiltered) {
      this.showWarning('Some words were filtered');
    }
    
    // Validate the word
    const validation = validateWord(filteredText, 'medium');
    
    if (!validation.isValid) {
      this.showError(`Invalid word: ${validation.reason}`);
      return;
    }
    
    // Calculate score
    const scoreResult = calculateScore(filteredText);
    this.addScore(scoreResult.totalScore);
    
    // Update display
    this.updateDisplay({
      word: filteredText,
      score: scoreResult.totalScore,
      breakdown: scoreResult.breakdown
    });
  }

  addScore(points) {
    this.gameState.score += points;
    this.updateScoreDisplay();
  }

  updateMicButton(isActive) {
    const micButton = document.getElementById('micButton');
    if (micButton) {
      micButton.classList.toggle('active', isActive);
      micButton.textContent = isActive ? '🎤 Stop' : '🎤 Start';
    }
  }

  updateInterimDisplay(text) {
    const interimDisplay = document.getElementById('interimResult');
    if (interimDisplay) {
      interimDisplay.textContent = text;
    }
  }

  updateDisplay(data) {
    const wordDisplay = document.getElementById('currentWord');
    const scoreDisplay = document.getElementById('wordScore');
    
    if (wordDisplay) {
      wordDisplay.textContent = data.word;
    }
    
    if (scoreDisplay) {
      scoreDisplay.textContent = data.score;
    }
  }

  updateScoreDisplay() {
    const scoreDisplay = document.getElementById('totalScore');
    if (scoreDisplay) {
      scoreDisplay.textContent = this.gameState.score;
    }
  }

  showError(message) {
    const errorDisplay = document.getElementById('errorMessage');
    if (errorDisplay) {
      errorDisplay.textContent = message;
      errorDisplay.style.display = 'block';
      setTimeout(() => {
        errorDisplay.style.display = 'none';
      }, 3000);
    }
  }

  showWarning(message) {
    const warningDisplay = document.getElementById('warningMessage');
    if (warningDisplay) {
      warningDisplay.textContent = message;
      warningDisplay.style.display = 'block';
      setTimeout(() => {
        warningDisplay.style.display = 'none';
      }, 3000);
    }
  }
}

// Initialize when DOM is ready
let gameIntegration;

document.addEventListener('DOMContentLoaded', () => {
  gameIntegration = new GameIntegration();
  
  // Set up mic button
  const micButton = document.getElementById('micButton');
  if (micButton) {
    micButton.addEventListener('click', () => {
      if (gameIntegration.isListening) {
        gameIntegration.stopListening();
      } else {
        gameIntegration.startListening();
      }
    });
  }
});

export default gameIntegration;
