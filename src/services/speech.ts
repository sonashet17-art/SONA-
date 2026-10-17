// Speech Synthesis (Text-to-Speech) & Speech Recognition (Voice Input) service
// Designed for universal accessibility (seniors, children, visually impaired, motor difficulties)

export const speechService = {
  isTTSAvailable(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  },

  isSTTAvailable(): boolean {
    return (
      typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
    );
  },

  speak(text: string, onEnd?: () => void, speed: number = 0.9): () => void {
    if (!this.isTTSAvailable()) {
      if (onEnd) onEnd();
      return () => {};
    }

    try {
      window.speechSynthesis.cancel(); // Stop any active speech

      // Clean text from markdown asterisks and URLs for natural listening
      const cleanText = text
        .replace(/[*#_~`]/g, '')
        .replace(/https?:\/\/\S+/g, 'link')
        .replace(/•/g, ', ')
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = speed; // Slightly gentle for elderly and children
      utterance.pitch = 1.0;

      utterance.onend = () => {
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis error/cancelled:', e);
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);

      return () => {
        window.speechSynthesis.cancel();
      };
    } catch (err) {
      console.warn('TTS execution error:', err);
      if (onEnd) onEnd();
      return () => {};
    }
  },

  stopSpeaking() {
    if (this.isTTSAvailable()) {
      try {
        window.speechSynthesis.cancel();
      } catch (err) {
        // ignore
      }
    }
  },

  startListening(
    onResult: (transcript: string) => void,
    onError?: (error: string) => void,
    onEnd?: () => void
  ): { stop: () => void } | null {
    if (!this.isSTTAvailable()) {
      if (onError) onError('Speech recognition is not supported in this browser.');
      return null;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        onResult(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (onError) onError(event.error || 'Failed to capture speech');
      };

      recognition.onend = () => {
        if (onEnd) onEnd();
      };

      recognition.start();

      return {
        stop: () => {
          try {
            recognition.stop();
          } catch (e) {
            // ignore
          }
        },
      };
    } catch (err: any) {
      console.warn('Failed to start speech recognition:', err);
      if (onError) onError(err?.message || 'Unable to access microphone');
      return null;
    }
  },
};
