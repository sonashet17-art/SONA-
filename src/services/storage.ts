import { UserProfile, JournalEntry, MoodLog, ChatMessage } from '../types';
import { INITIAL_JOURNAL_SAMPLE } from '../data/mockData';

const USER_KEY = 'auracare_user';
const JOURNALS_KEY = 'auracare_journals';
const MOODS_KEY = 'auracare_moods';
const SYMPTOM_HISTORY_KEY = 'auracare_symptom_history';

export const storage = {
  getUser(): UserProfile {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fallback
      }
    }
    const defaultGuest: UserProfile = {
      id: 'guest-' + Math.random().toString(36).substring(2, 9),
      name: 'Guest User',
      email: 'guest@auracare.internal',
      role: 'Student',
      isGuest: true,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(USER_KEY, JSON.stringify(defaultGuest));
    return defaultGuest;
  },

  setUser(user: UserProfile) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  logoutUser() {
    const defaultGuest: UserProfile = {
      id: 'guest-' + Math.random().toString(36).substring(2, 9),
      name: 'Guest User',
      email: 'guest@auracare.internal',
      role: 'Student',
      isGuest: true,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(USER_KEY, JSON.stringify(defaultGuest));
    return defaultGuest;
  },

  getJournals(): JournalEntry[] {
    const raw = localStorage.getItem(JOURNALS_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fallback
      }
    }
    const initial = [INITIAL_JOURNAL_SAMPLE];
    localStorage.setItem(JOURNALS_KEY, JSON.stringify(initial));
    return initial;
  },

  saveJournal(entry: JournalEntry): JournalEntry[] {
    const existing = this.getJournals();
    const updated = [entry, ...existing.filter(j => j.id !== entry.id)];
    localStorage.setItem(JOURNALS_KEY, JSON.stringify(updated));
    return updated;
  },

  deleteJournal(id: string): JournalEntry[] {
    const existing = this.getJournals();
    const updated = existing.filter(j => j.id !== id);
    localStorage.setItem(JOURNALS_KEY, JSON.stringify(updated));
    return updated;
  },

  getMoodLogs(): MoodLog[] {
    const raw = localStorage.getItem(MOODS_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fallback
      }
    }
    // Seed 7 days of recent moods for trend visualization
    const today = new Date();
    const demoLogs: MoodLog[] = [
      { id: 'm1', date: new Date(today.getTime() - 6 * 86400000).toISOString().split('T')[0], score: 6, mood: 'Calm', stressScore: 40 },
      { id: 'm2', date: new Date(today.getTime() - 5 * 86400000).toISOString().split('T')[0], score: 5, mood: 'Stressed', stressScore: 65 },
      { id: 'm3', date: new Date(today.getTime() - 4 * 86400000).toISOString().split('T')[0], score: 7, mood: 'Calm', stressScore: 35 },
      { id: 'm4', date: new Date(today.getTime() - 3 * 86400000).toISOString().split('T')[0], score: 4, mood: 'Anxious', stressScore: 75 },
      { id: 'm5', date: new Date(today.getTime() - 2 * 86400000).toISOString().split('T')[0], score: 5, mood: 'Exhausted', stressScore: 60 },
      { id: 'm6', date: new Date(today.getTime() - 1 * 86400000).toISOString().split('T')[0], score: 7, mood: 'Calm', stressScore: 38 },
      { id: 'm7', date: today.toISOString().split('T')[0], score: 8, mood: 'Joyful', stressScore: 25 },
    ];
    localStorage.setItem(MOODS_KEY, JSON.stringify(demoLogs));
    return demoLogs;
  },

  saveMoodLog(log: MoodLog): MoodLog[] {
    const existing = this.getMoodLogs();
    const updated = [...existing.filter(m => m.date !== log.date), log].sort((a, b) => a.date.localeCompare(b.date));
    localStorage.setItem(MOODS_KEY, JSON.stringify(updated));
    return updated;
  },

  getSymptomHistory(): ChatMessage[] {
    const raw = localStorage.getItem(SYMPTOM_HISTORY_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fallback
      }
    }
    return [];
  },

  saveSymptomCheck(msg: ChatMessage) {
    const existing = this.getSymptomHistory();
    const updated = [msg, ...existing].slice(0, 30);
    localStorage.setItem(SYMPTOM_HISTORY_KEY, JSON.stringify(updated));
  },

  getAccessibilitySettings(): import('../types').AccessibilitySettings {
    const raw = localStorage.getItem('auracare_accessibility');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fallback
      }
    }
    return {
      fontSize: 'normal',
      highContrast: false,
      simplifiedLanguage: false,
      screenReaderVoice: false,
    };
  },

  saveAccessibilitySettings(settings: import('../types').AccessibilitySettings) {
    localStorage.setItem('auracare_accessibility', JSON.stringify(settings));
    return settings;
  }
};
