// Web Speech API utility for Text-to-Speech (TTS) and Speech-to-Text (STT)
// Designed for seniors, children, visually impaired, or motor-impaired users of any age

export const speech = {
  speak(text: string, onEnd?: () => void) {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser.');
      return;
    }
    window.speechSynthesis.cancel(); // Stop any active speech

    // Clean text of markdown asterisks, hashtags, or excessive characters
    const cleanText = text
      .replace(/[*_#`~]/g, '')
      .replace(/https?:\/\/\S+/g, 'link')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95; // Slightly slower, clear cadence for elderly/children
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  },

  stop() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  },

  isSpeaking(): boolean {
    return 'speechSynthesis' in window && window.speechSynthesis.speaking;
  },

  createSpeechRecognition(
    onResult: (transcript: string) => void,
    onError?: (err: any) => void
  ) {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    if (onError) {
      recognition.onerror = onError;
    }

    return recognition;
  }
};
