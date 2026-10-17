import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ChatMessage, JournalEntry, MoodLog, AccessibilitySettings } from '../../types';
import { api } from '../../services/api';
import { storage } from '../../services/storage';
import { AFFIRMATIONS } from '../../data/mockData';
import { BreathingExercise } from './BreathingExercise';
import { GroundingTool } from './GroundingTool';
import { speech } from '../../utils/speech';
import {
  Brain,
  Heart,
  Send,
  Sparkles,
  BookOpen,
  TrendingUp,
  Wind,
  Phone,
  Smile,
  Frown,
  Meh,
  PlusCircle,
  Calendar,
  Trash2,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Shield,
  Lightbulb,
  MapPin
} from 'lucide-react';

interface EmotionalHealthProps {
  currentUser: UserProfile;
  initialPrompt?: string;
  onOpenPsychologistModal: () => void;
  onOpenNearbyMaps?: (category?: 'all' | 'hospital' | 'doctor' | 'psychology') => void;
  accessibilitySettings?: AccessibilitySettings;
}

export const EmotionalHealth: React.FC<EmotionalHealthProps> = ({
  currentUser,
  initialPrompt,
  onOpenPsychologistModal,
  onOpenNearbyMaps,
  accessibilitySettings,
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'journal' | 'tracker' | 'coping'>('chat');

  // --- 1. Chatbot State ---
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'init-emo-1',
      sender: 'bot',
      text: `Hello ${currentUser.isGuest ? 'friend' : currentUser.name}. I am your AuraCare Emotional Support Companion. 

This is your safe, completely confidential space. Whatever stress, exam tension, fatigue, or heavy thoughts you are carrying today—you do not have to face them alone. 

How has your heart and mind been feeling today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      emotionalTone: 'Warm & Empathetic',
      affirmation: 'You have navigated heavy days before; take this moment one gentle breath at a time.',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- 2. Journal State ---
  const [journals, setJournals] = useState<JournalEntry[]>(() => storage.getJournals());
  const [journalTitle, setJournalTitle] = useState('');
  const [journalContent, setJournalContent] = useState('');
  const [journalMood, setJournalMood] = useState<JournalEntry['mood']>('Calm');
  const [journalTags, setJournalTags] = useState<string[]>(['Daily Reflection']);
  const [newTagInput, setNewTagInput] = useState('');
  const [analyzingJournal, setAnalyzingJournal] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState<JournalEntry | null>(journals[0] || null);

  // --- 3. Mood Tracker State ---
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>(() => storage.getMoodLogs());
  const [todayMoodScore, setTodayMoodScore] = useState(7);
  const [todayMoodLabel, setTodayMoodLabel] = useState('Calm');
  const [loggedToday, setLoggedToday] = useState(false);

  // --- 4. Affirmations & Speech State ---
  const [currentAffirmationIndex, setCurrentAffirmationIndex] = useState(0);
  const [speakingAffirmation, setSpeakingAffirmation] = useState(false);
  const [isListeningChat, setIsListeningChat] = useState(false);
  const [isListeningJournal, setIsListeningJournal] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const chatRecRef = useRef<any>(null);
  const journalRecRef = useRef<any>(null);

  // Scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatLoading]);

  // Handle initial prompt
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      if (initialPrompt.toLowerCase().includes('journal')) {
        setActiveTab('journal');
      } else if (initialPrompt.toLowerCase().includes('breath')) {
        setActiveTab('coping');
      } else {
        handleSendChat(initialPrompt);
      }
    }
  }, []);

  const handleToggleChatDictation = () => {
    if (isListeningChat) {
      if (chatRecRef.current) chatRecRef.current.stop();
      setIsListeningChat(false);
    } else {
      const rec = speech.createSpeechRecognition(
        (transcript) => {
          setChatInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsListeningChat(false);
        },
        (err) => {
          console.warn('Chat dictation error:', err);
          setIsListeningChat(false);
        }
      );
      if (rec) {
        chatRecRef.current = rec;
        try {
          rec.start();
          setIsListeningChat(true);
        } catch {
          setIsListeningChat(false);
        }
      } else {
        alert('Speech-to-text is not supported by your current browser.');
      }
    }
  };

  const handleToggleJournalDictation = () => {
    if (isListeningJournal) {
      if (journalRecRef.current) journalRecRef.current.stop();
      setIsListeningJournal(false);
    } else {
      const rec = speech.createSpeechRecognition(
        (transcript) => {
          setJournalContent((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsListeningJournal(false);
        },
        (err) => {
          console.warn('Journal dictation error:', err);
          setIsListeningJournal(false);
        }
      );
      if (rec) {
        journalRecRef.current = rec;
        try {
          rec.start();
          setIsListeningJournal(true);
        } catch {
          setIsListeningJournal(false);
        }
      } else {
        alert('Speech-to-text is not supported by your current browser.');
      }
    }
  };

  const handleToggleSpeak = (msgId: string, text: string) => {
    if (speakingMsgId === msgId) {
      speech.stop();
      setSpeakingMsgId(null);
    } else {
      speech.speak(text, () => setSpeakingMsgId(null));
      setSpeakingMsgId(msgId);
    }
  };

  // Chat message send handler
  const handleSendChat = async (textToSend?: string) => {
    const text = (textToSend || chatInput).trim();
    if (!text || chatLoading) return;

    if (isListeningChat && chatRecRef.current) {
      chatRecRef.current.stop();
      setIsListeningChat(false);
    }

    const userMsg: ChatMessage = {
      id: 'usr-emo-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedList = [...chatMessages, userMsg];
    setChatMessages(updatedList);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await api.chatEmotional(
        updatedList.map((m) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          text: m.text,
        })),
        currentUser
      );

      const botMsg: ChatMessage = {
        id: 'bot-emo-' + Date.now(),
        sender: 'bot',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emotionalTone: response.emotionalToneDetected,
        affirmation: response.encouragingAffirmation,
        copingTip: response.copingTip,
        suggestedExercise: response.suggestedCopingExercise,
      };

      setChatMessages((prev) => [...prev, botMsg]);

      // Read aloud if voice assistance is active
      if (accessibilitySettings?.screenReaderVoice) {
        handleToggleSpeak(botMsg.id, response.reply);
      }
    } catch (err) {
      console.error('Emotional chat error:', err);
    } finally {
      setChatLoading(false);
    }
  };

  // Journal analysis and save handler
  const handleSaveAndAnalyzeJournal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalContent.trim()) return;

    setAnalyzingJournal(true);
    try {
      const analysis = await api.analyzeJournal(
        journalContent,
        journalMood,
        journalTags
      );

      const newEntry: JournalEntry = {
        id: 'entry-' + Date.now(),
        date: new Date().toISOString(),
        title: journalTitle.trim() || `Journal • ${new Date().toLocaleDateString()}`,
        content: journalContent.trim(),
        mood: journalMood,
        tags: journalTags,
        stressAnalysis: analysis,
      };

      const updated = storage.saveJournal(newEntry);
      setJournals(updated);
      setSelectedJournal(newEntry);

      // Also record into mood logs
      const log: MoodLog = {
        id: 'log-' + Date.now(),
        date: new Date().toISOString().split('T')[0],
        score: journalMood === 'Joyful' ? 9 : journalMood === 'Calm' ? 7 : journalMood === 'Frustrated' ? 4 : 3,
        mood: journalMood,
        stressScore: analysis.stressScore,
        note: journalTitle,
      };
      const updatedLogs = storage.saveMoodLog(log);
      setMoodLogs(updatedLogs);

      // Reset form
      setJournalTitle('');
      setJournalContent('');
      setJournalTags(['Daily Reflection']);
    } catch (err) {
      console.error('Error analyzing journal:', err);
    } finally {
      setAnalyzingJournal(false);
    }
  };

  const handleDeleteJournal = (id: string) => {
    const updated = storage.deleteJournal(id);
    setJournals(updated);
    if (selectedJournal?.id === id) {
      setSelectedJournal(updated[0] || null);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTagInput.trim()) {
      e.preventDefault();
      if (!journalTags.includes(newTagInput.trim())) {
        setJournalTags([...journalTags, newTagInput.trim()]);
      }
      setNewTagInput('');
    }
  };

  const handleSaveDailyMood = () => {
    const today = new Date().toISOString().split('T')[0];
    const log: MoodLog = {
      id: 'log-' + Date.now(),
      date: today,
      score: todayMoodScore,
      mood: todayMoodLabel,
      stressScore: Math.round((10 - todayMoodScore) * 10),
    };
    const updated = storage.saveMoodLog(log);
    setMoodLogs(updated);
    setLoggedToday(true);
  };

  const speakAffirmation = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      setSpeakingAffirmation(true);
      utterance.onend = () => setSpeakingAffirmation(false);
      utterance.onerror = () => setSpeakingAffirmation(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Average stress calculation for Tracker
  const avgStress = moodLogs.length
    ? Math.round(moodLogs.reduce((acc, m) => acc + (m.stressScore || 40), 0) / moodLogs.length)
    : 45;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 sm:py-8">
      {/* Title & Navigation Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
            <span className="text-xs uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400">
              Module 2 • Emotional Health Care & Emotion Tracker
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Emotional Wellness & Sanctuary
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            A private haven to process daily stress and anxiety. Interactive AI support, journal stress pattern analysis, positive coping mechanisms, and licensed psychologists.
          </p>
        </div>

        {/* Quick Psychologist & Crisis helpline trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenNearbyMaps?.('psychology')}
            className="px-3.5 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-indigo-600" />
            <span>Nearby Clinics on Maps</span>
          </button>
          <button
            onClick={onOpenPsychologistModal}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            Connect with Psychologists
          </button>
          <a
            href="tel:14416"
            className="px-3 py-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 hover:bg-purple-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-purple-600" />
            14416 Free Helpline
          </a>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 no-scrollbar">
        {[
          { key: 'chat', label: 'AI Comfort & Motivation Bot', icon: Brain },
          { key: 'journal', label: 'Journal & Stress Pattern AI', icon: BookOpen },
          { key: 'tracker', label: 'Visual Progress & Mood Tracker', icon: TrendingUp },
          { key: 'coping', label: 'Positive Coping Mechanisms', icon: Wind },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`shrink-0 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* --- TAB 1: AI COMFORT & MOTIVATION BOT --- */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Chat Window (Col 8) */}
          <div className="lg:col-span-8 flex flex-col rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-lg overflow-hidden h-[660px]">
            {/* Header */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>AuraCare Emotional Companion</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Empathetic listening, validation & cognitive reframing
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 flex items-center gap-1">
                <Shield className="w-3 h-3 text-indigo-600" /> 100% Private
              </span>
            </div>

            {/* Quick Prompt Starters */}
            <div className="px-4 py-2.5 bg-slate-100/60 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
              <span className="text-[11px] font-semibold text-slate-400 shrink-0">Quick share:</span>
              {[
                "I'm overwhelmed with exam deadlines and feel behind",
                "I'm feeling anxious and my chest feels tight",
                "Work burnout is making me feel detached and tired",
                "I need an encouraging reminder about my self-worth",
                "Can you guide me through a calming visualization?"
              ].map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendChat(prompt)}
                  className="shrink-0 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-slate-700 dark:text-slate-300 hover:text-indigo-600 text-xs transition-colors cursor-pointer"
                >
                  {prompt.length > 35 ? prompt.slice(0, 35) + '...' : prompt}
                </button>
              ))}
            </div>

            {/* Messages Feed */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                      <Heart className="w-4 h-4 fill-white/80" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : 'bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200/80 dark:border-slate-800'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>

                    {/* Bot Emotional Insight Box */}
                    {msg.sender === 'bot' && msg.emotionalTone && (
                      <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 space-y-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Tone sensed:
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 text-[11px] font-semibold">
                            {msg.emotionalTone}
                          </span>
                        </div>

                        {msg.copingTip && (
                          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-xs text-indigo-950 dark:text-indigo-200 flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <div>
                              <strong className="block text-[11px] uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                                Positive Coping Recommendation:
                              </strong>
                              <span>{msg.copingTip}</span>
                            </div>
                          </div>
                        )}

                        {msg.affirmation && (
                          <div className="text-[11px] italic text-indigo-700 dark:text-indigo-300 bg-white/60 dark:bg-slate-800/60 p-2 rounded-lg">
                            ✨ "{msg.affirmation}"
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-200/50 dark:border-slate-800">
                      {msg.sender === 'bot' && (
                        <button
                          type="button"
                          onClick={() => handleToggleSpeak(msg.id, msg.text)}
                          className="px-2 py-0.5 rounded-lg text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300 cursor-pointer flex items-center gap-1.5 text-[11px] hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                          title="Listen to this message read aloud"
                          aria-label="Read message aloud"
                        >
                          {speakingMsgId === msg.id ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                              <span className="text-red-500 font-bold text-[10px]">Stop Audio</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                              <span className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-300">Read Aloud</span>
                            </>
                          )}
                        </button>
                      )}
                      <div
                        className={`text-[10px] ml-auto opacity-60 ${
                          msg.sender === 'user' ? 'text-indigo-100' : 'text-slate-400'
                        }`}
                      >
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="flex gap-3 justify-start items-center">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs animate-pulse">
                    <Heart className="w-4 h-4 fill-white" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-center gap-2">
                    <span className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></span>
                      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]"></span>
                    </span>
                    <span>Reflecting with empathy & compassion...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input with Microphone Dictation */}
            <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChat();
                }}
                className="flex items-center gap-2"
              >
                {/* Voice Dictation (Microphone) */}
                <button
                  type="button"
                  onClick={handleToggleChatDictation}
                  className={`p-3 rounded-2xl transition-all cursor-pointer shadow-xs shrink-0 ${
                    isListeningChat
                      ? 'bg-red-500 text-white animate-pulse ring-2 ring-red-400'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                  }`}
                  title={isListeningChat ? 'Listening to your voice... Click to stop' : 'Click to talk with your voice'}
                  aria-label={isListeningChat ? 'Stop voice recording' : 'Talk by microphone'}
                >
                  {isListeningChat ? (
                    <MicOff className="w-5 h-5 animate-pulse" />
                  ) : (
                    <Mic className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  )}
                </button>

                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={isListeningChat ? 'Listening to your voice...' : 'Share what is on your mind or how you\'re feeling...'}
                  className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={chatLoading || !chatInput.trim()}
                  className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white shadow-md transition-all cursor-pointer shrink-0"
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>

          {/* Right Sidebar: Daily Motivation & Quick Coping Triggers (Col 4) */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            {/* Daily Affirmation Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Daily Motivational Anchor
                </span>
                <button
                  onClick={() => speakAffirmation(AFFIRMATIONS[currentAffirmationIndex])}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
                  title="Read aloud"
                >
                  <Volume2 className={`w-4 h-4 ${speakingAffirmation ? 'text-amber-300 animate-pulse' : ''}`} />
                </button>
              </div>

              <blockquote className="text-sm sm:text-base font-semibold leading-relaxed my-3">
                "{AFFIRMATIONS[currentAffirmationIndex]}"
              </blockquote>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/20">
                <span className="text-[10px] text-indigo-200">
                  Affirmation {currentAffirmationIndex + 1} of {AFFIRMATIONS.length}
                </span>
                <button
                  onClick={() =>
                    setCurrentAffirmationIndex((prev) => (prev + 1) % AFFIRMATIONS.length)
                  }
                  className="px-3 py-1 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Next Affirmation →
                </button>
              </div>
            </div>

            {/* Quick Box Breathing Widget in chat view */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-indigo-600" />
                  Instant Calm Breathing
                </h4>
                <button
                  onClick={() => setActiveTab('coping')}
                  className="text-[11px] font-semibold text-indigo-600 hover:underline cursor-pointer"
                >
                  Full Tool →
                </button>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                Feeling racing thoughts? Regulate your nervous system in 60 seconds.
              </p>
              <button
                onClick={() => setActiveTab('coping')}
                className="w-full py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold text-xs hover:bg-indigo-100 transition-colors cursor-pointer"
              >
                Launch Guided Box Breathing
              </button>
            </div>

            {/* Psychologist Connect Trigger */}
            <div className="p-5 rounded-3xl bg-slate-900 text-white shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <UserCheck className="w-5 h-5 text-indigo-400" />
                  <h4 className="text-sm font-bold">Talk to a Licensed Psychologist</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Confidential individual therapy for students, academics, and working professionals with NIMHANS & RCI certified counselors.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col gap-2">
                <button
                  onClick={onOpenPsychologistModal}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  Schedule Tele-Counseling
                </button>
                <div className="text-[10px] text-center text-slate-400">
                  Free 24/7 National Helpline: <a href="tel:14416" className="text-indigo-400 font-bold underline">14416</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: JOURNALING & AI STRESS PATTERN ANALYSIS --- */}
      {activeTab === 'journal' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Write New Journal Entry (Col 7) */}
          <div className="lg:col-span-7 flex flex-col rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  Daily Emotional Journal
                </h3>
                <p className="text-xs text-slate-500">
                  Write freely. AuraCare's AI analyzes recurring stress patterns and offers positive coping strategies.
                </p>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 font-semibold text-slate-600 dark:text-slate-300">
                {journals.length} Saved Entries
              </span>
            </div>

            <form onSubmit={handleSaveAndAnalyzeJournal} className="space-y-4">
              {/* Mood Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  How are you feeling right now?
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {[
                    { mood: 'Joyful', icon: '😊' },
                    { mood: 'Calm', icon: '😌' },
                    { mood: 'Anxious', icon: '😰' },
                    { mood: 'Stressed', icon: '😣' },
                    { mood: 'Exhausted', icon: '😴' },
                    { mood: 'Sad', icon: '😢' },
                    { mood: 'Frustrated', icon: '😤' },
                  ].map((m) => (
                    <button
                      type="button"
                      key={m.mood}
                      onClick={() => setJournalMood(m.mood as any)}
                      className={`p-2.5 rounded-2xl border text-center flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        journalMood === m.mood
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-xl">{m.icon}</span>
                      <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                        {m.mood}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title Input */}
              <div>
                <input
                  type="text"
                  value={journalTitle}
                  onChange={(e) => setJournalTitle(e.target.value)}
                  placeholder="Give today's reflection a title (e.g. Pre-exam nerves, Long study session)..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Journal Content with Voice Dictation */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Journal Thoughts & Reflections:
                  </label>
                  <button
                    type="button"
                    onClick={handleToggleJournalDictation}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                      isListeningJournal
                        ? 'bg-red-500 text-white animate-pulse ring-2 ring-red-400'
                        : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60'
                    }`}
                  >
                    {isListeningJournal ? (
                      <MicOff className="w-3.5 h-3.5 animate-pulse" />
                    ) : (
                      <Mic className="w-3.5 h-3.5" />
                    )}
                    <span>{isListeningJournal ? 'Listening... click to finish' : 'Dictate with Voice (Microphone)'}</span>
                  </button>
                </div>
                <textarea
                  rows={7}
                  required
                  value={journalContent}
                  onChange={(e) => setJournalContent(e.target.value)}
                  placeholder={
                    isListeningJournal
                      ? 'Listening to your voice... Speak freely...'
                      : "Express your raw thoughts here without filter. What happened today? What thoughts kept repeating? How does your body feel?..."
                  }
                  className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Tags Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Context Tags (Press Enter to add):
                </label>
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  {journalTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 text-xs font-semibold flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => setJournalTags(journalTags.filter((t) => t !== tag))}
                        className="hover:text-red-500 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Type tag (e.g. Exams, Sleep, Work, Family) and hit Enter"
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={analyzingJournal || !journalContent.trim()}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className={`w-4 h-4 ${analyzingJournal ? 'animate-spin' : ''}`} />
                <span>
                  {analyzingJournal
                    ? 'AI Analyzing Stress Patterns & Coping...'
                    : 'Save & Analyze Stress Patterns'}
                </span>
              </button>
            </form>
          </div>

          {/* Right: AI Stress Analysis Feedback & Entries History (Col 5) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Selected Entry Analysis Card */}
            {selectedJournal?.stressAnalysis ? (
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400">
                    AI Stress Pattern Analysis
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      selectedJournal.stressAnalysis.stressLevel === 'High'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : selectedJournal.stressAnalysis.stressLevel === 'Moderate'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    {selectedJournal.stressAnalysis.stressLevel} Stress ({selectedJournal.stressAnalysis.stressScore}/100)
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  {selectedJournal.title}
                </h4>

                {/* Empathetic reflection with Read Aloud */}
                <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed italic relative">
                  <div className="flex items-start justify-between gap-2">
                    <span>"{selectedJournal.stressAnalysis.empatheticReflection}"</span>
                    <button
                      type="button"
                      onClick={() => handleToggleSpeak(`reflection-${selectedJournal.id}`, selectedJournal.stressAnalysis!.empatheticReflection)}
                      className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 cursor-pointer shrink-0"
                      title="Read reflection aloud"
                      aria-label="Read reflection aloud"
                    >
                      {speakingMsgId === `reflection-${selectedJournal.id}` ? (
                        <VolumeX className="w-4 h-4 text-red-500 animate-pulse" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Detected Patterns */}
                <div>
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                    Identified Stress Patterns & Triggers:
                  </div>
                  <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400 list-disc pl-4">
                    {selectedJournal.stressAnalysis.stressPatterns.map((pat, idx) => (
                      <li key={idx}>{pat}</li>
                    ))}
                  </ul>
                </div>

                {/* Positive Coping Mechanisms */}
                <div>
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Positive Coping Actions:
                  </div>
                  <div className="space-y-1.5">
                    {selectedJournal.stressAnalysis.positiveCopingMechanisms.map((mech, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200"
                      >
                        • {mech}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Uplifting Quote */}
                <div className="pt-2 text-[11px] text-slate-500 text-center border-t border-slate-100 dark:border-slate-700">
                  {selectedJournal.stressAnalysis.upliftingQuote}
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs text-slate-500">
                Write and submit an entry on the left to see instant AI stress pattern analysis and actionable coping mechanisms.
              </div>
            )}

            {/* Previous Entries List */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-3">
                Previous Journal Entries
              </h4>
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {journals.map((j) => (
                  <div
                    key={j.id}
                    onClick={() => setSelectedJournal(j)}
                    className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                      selectedJournal?.id === j.id
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                        {j.title}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {new Date(j.date).toLocaleDateString()} • Mood: {j.mood}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteJournal(j.id);
                      }}
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 3: VISUAL PROGRESS & MOOD TRACKER --- */}
      {activeTab === 'tracker' && (
        <div className="space-y-6">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
              <div className="text-xs text-slate-500 font-medium">Emotional Balance Score</div>
              <div className="text-3xl font-black text-indigo-600 mt-1">
                {100 - avgStress}%
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Resilient Baseline
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
              <div className="text-xs text-slate-500 font-medium">Average Stress Level</div>
              <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                {avgStress}<span className="text-sm font-normal text-slate-400">/100</span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium mt-1">
                Based on recent logs
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
              <div className="text-xs text-slate-500 font-medium">Mindful Journal Streak</div>
              <div className="text-3xl font-black text-amber-500 mt-1">
                {moodLogs.length} Days
              </div>
              <div className="text-[11px] text-amber-600 font-semibold mt-1">
                Active self-reflection
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
              <div className="text-xs text-slate-500 font-medium">Coping Tools Used</div>
              <div className="text-3xl font-black text-teal-600 mt-1">
                12
              </div>
              <div className="text-[11px] text-teal-600 font-semibold mt-1">
                Breathing & Grounding
              </div>
            </div>
          </div>

          {/* Daily Mood Check-In Widget */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Log Today's Mood Check-in
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Rate your well-being on a scale from 1 (deeply distressed) to 10 (thriving and joyful).
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <input
                type="range"
                min="1"
                max="10"
                value={todayMoodScore}
                onChange={(e) => {
                  const score = parseInt(e.target.value, 10);
                  setTodayMoodScore(score);
                  setTodayMoodLabel(score >= 8 ? 'Joyful' : score >= 6 ? 'Calm' : score >= 4 ? 'Stressed' : 'Anxious');
                }}
                className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-2xl font-black text-indigo-600 w-8 text-center">
                  {todayMoodScore}
                </span>
                <span className="px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                  {todayMoodLabel}
                </span>
                <button
                  onClick={handleSaveDailyMood}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  {loggedToday ? 'Updated Log' : 'Save Check-in'}
                </button>
              </div>
            </div>
          </div>

          {/* Visual Mood Trends Chart (SVG Bar Chart) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  7-Day Mood & Stress Trend
                </h3>
                <p className="text-[11px] text-slate-500">
                  Visual representation of mood scores (height) and stress indicators (color).
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Calm/Joy
                </span>
                <span className="flex items-center gap-1 text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> High Stress
                </span>
              </div>
            </div>

            {/* Chart Area */}
            <div className="h-56 w-full flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-200 dark:border-slate-700">
              {moodLogs.slice(-7).map((log, i) => {
                const heightPercent = Math.max(15, (log.score / 10) * 100);
                const isHighStress = log.stressScore >= 60;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <div className="text-[11px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      {log.score}/10
                    </div>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full max-w-[40px] rounded-t-xl transition-all duration-500 ${
                        isHighStress
                          ? 'bg-gradient-to-t from-rose-600 to-pink-500 shadow-md shadow-rose-500/20'
                          : 'bg-gradient-to-t from-indigo-600 to-teal-400 shadow-md shadow-indigo-500/20'
                      }`}
                    />
                    <span className="text-[10px] font-semibold text-slate-400 truncate max-w-[44px]">
                      {log.date.slice(5)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 4: POSITIVE COPING MECHANISMS --- */}
      {activeTab === 'coping' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BreathingExercise />
          <GroundingTool />
        </div>
      )}
    </div>
  );
};
