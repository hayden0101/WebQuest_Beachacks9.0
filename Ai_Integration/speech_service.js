// Speech Recognition Service - ASI:One
// Web Speech API implementation

class SpeechService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.transcript = '';
    this.onResult = null;
    this.onError = null;
    this.onEnd = null;
    
    this.initializeRecognition();
  }

  initializeRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition not supported in this browser');
      return false;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      this.transcript = finalTranscript || interimTranscript;
      
      if (this.onResult && (finalTranscript || interimTranscript)) {
        this.onResult({
          final: finalTranscript || null,
          interim: interimTranscript,
          full: this.transcript
        });
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
      
      if (this.onError) {
        this.onError(event.error);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      
      if (this.onEnd) {
        this.onEnd(this.transcript);
      }
    };

    return true;
  }

  startListening(callbacks = {}) {
    if (!this.recognition) {
      const initialized = this.initializeRecognition();
      if (!initialized) {
        return false;
      }
    }

    if (this.isListening) {
      return true;
    }

    this.onResult = callbacks.onResult;
    this.onError = callbacks.onError;
    this.onEnd = callbacks.onEnd;

    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      return false;
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
        this.isListening = false;
        return true;
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
        return false;
      }
    }
    return false;
  }

  getTranscript() {
    return this.transcript;
  }

  reset() {
    this.transcript = '';
    this.isListening = false;
  }
}

const speechService = new SpeechService();

export function startListening(callbacks) {
  return speechService.startListening(callbacks);
}

export function stopListening() {
  return speechService.stopListening();
}

export function getTranscript() {
  return speechService.getTranscript();
}

export function isListening() {
  return speechService.isListening;
}

export function reset() {
  return speechService.reset();
}

export default speechService;
