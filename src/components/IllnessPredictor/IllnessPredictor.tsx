import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ChatMessage, SymptomAnalysis, AccessibilitySettings } from '../../types';
import { api } from '../../services/api';
import { storage } from '../../services/storage';
import { speech } from '../../utils/speech';
import {
  Bot,
  Send,
  AlertTriangle,
  PhoneCall,
  ShieldAlert,
  Stethoscope,
  HeartPulse,
  Thermometer,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Calendar,
  Flame,
  Info,
  Clock,
  UserCheck,
  MapPin,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  BookOpen
} from 'lucide-react';

interface IllnessPredictorProps {
  currentUser: UserProfile;
  initialPrompt?: string;
  onOpenDoctorModal: (specialty?: string, symptoms?: string[]) => void;
  onOpenEmergencyModal: (reason?: string) => void;
  onOpenNearbyMaps?: (category?: 'all' | 'hospital' | 'doctor' | 'psychology') => void;
  accessibilitySettings?: AccessibilitySettings;
}

export const IllnessPredictor: React.FC<IllnessPredictorProps> = ({
  currentUser,
  initialPrompt,
  onOpenDoctorModal,
  onOpenEmergencyModal,
  onOpenNearbyMaps,
  accessibilitySettings,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'init-1',
        sender: 'bot',
        text: `Hello ${currentUser.isGuest ? 'there' : currentUser.name}! I am your AuraCare Illness Predictor. How are you feeling today? 

Please tell me what symptoms you are experiencing (for example: cold, cough, body pain, headache, stomachache, or any other discomfort). I will evaluate them according to verified clinical guidelines, map your risk score, and guide your next steps.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [latestAnalysis, setLatestAnalysis] = useState<SymptomAnalysis | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Handle initial prompt if passed
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt);
    }
  }, []);

  const handleToggleDictation = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      const rec = speech.createSpeechRecognition(
        (transcript) => {
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsListening(false);
        },
        (err) => {
          console.warn('Speech recognition error:', err);
          setIsListening(false);
        }
      );
      if (rec) {
        recognitionRef.current = rec;
        try {
          rec.start();
          setIsListening(true);
        } catch {
          setIsListening(false);
        }
      } else {
        alert('Speech-to-text is not supported by your current browser. You can type directly.');
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

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || loading) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    setLoading(true);

    try {
      const response = await api.checkSymptoms(
        newMessages.map((m) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          text: m.text,
        })),
        text,
        currentUser
      );

      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        analysis: response,
      };

      setMessages((prev) => [...prev, botMsg]);
      setLatestAnalysis(response);
      storage.saveSymptomCheck(botMsg);

      // Read aloud if accessibility auto-read is enabled
      if (accessibilitySettings?.screenReaderVoice) {
        handleToggleSpeak(botMsg.id, response.reply);
      }
    } catch (err) {
      console.error('Error checking symptoms:', err);
      const fallbackMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: 'I am actively reviewing your symptoms. Please drink warm water, avoid cold drinks, and rest comfortably. If symptoms are severe, please call 108 or 112 immediately.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickChip = (symptom: string) => {
    handleSendMessage(`I am having ${symptom}. Please guide me on care steps.`);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'init-' + Date.now(),
        sender: 'bot',
        text: `Hello ${currentUser.isGuest ? 'there' : currentUser.name}! How are you feeling right now? Please describe any symptoms you are noticing (cold, cough, body pain, headache, stomachache, or anything else).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setLatestAnalysis(null);
    setCompletedSteps({});
  };

  const toggleStep = (step: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [step]: !prev[step],
    }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 sm:py-8">
      {/* Module Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse"></span>
            <span className="text-xs uppercase tracking-wider font-bold text-teal-600 dark:text-teal-400">
              Module 1 • Clinical Symptom Screening & Seasonal Predictor
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Illness Predictor & Symptom Triage
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Preliminary medical evaluation backed by clinical guidelines. Maps risk levels, provides step-by-step home remedies, and escalates emergencies immediately.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenDoctorModal(latestAnalysis?.recommendedDoctorType, latestAnalysis?.detectedSymptoms)}
            className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Stethoscope className="w-4 h-4" />
            Connect with Doctors
          </button>
          <button
            onClick={handleResetChat}
            title="Start new consultation"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">New Check</span>
          </button>
        </div>
      </div>

      {/* Emergency Immediate Action Banner (If Severe / Emergency) */}
      {latestAnalysis?.isSevere && (
        <div className="mb-6 p-4 sm:p-5 rounded-3xl bg-red-600 text-white shadow-xl animate-pulse ring-4 ring-red-400/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-white text-red-600 flex items-center justify-center shrink-0 shadow-lg">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">
                HIGH RISK / EMERGENCY SYMPTOMS DETECTED
              </h3>
              <p className="text-xs text-red-100 mt-0.5 max-w-xl">
                Immediate professional emergency medical care is required. Direct ambulance and hospital response is available below.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <a
              href="tel:108"
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-red-600 hover:bg-red-50 font-black text-sm shadow-md transition-transform active:scale-95"
            >
              <PhoneCall className="w-4 h-4 text-red-600" />
              Call 108 Ambulance
            </a>
            <a
              href="tel:112"
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-black text-white hover:bg-slate-900 font-black text-sm shadow-md transition-transform active:scale-95"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Call 112 Emergency
            </a>
          </div>
        </div>
      )}

      {/* Main Grid: Interactive Chatbot (Left) + Clinical Triage & Risk Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Interactive AI Bot Chat (Col 7) */}
        <div className="lg:col-span-7 flex flex-col rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-lg overflow-hidden h-[680px]">
          {/* Chat Header */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>AuraCare Medical Bot</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Strictly protocol-aligned preliminary symptom screener
                </p>
              </div>
            </div>

            <div className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
              Interactive Triage
            </div>
          </div>

          {/* Quick Symptoms Bar */}
          <div className="px-4 py-2.5 bg-slate-100/60 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
            <span className="text-[11px] font-semibold text-slate-400 shrink-0">Tap symptom:</span>
            {[
              { label: 'Cold / Runny nose', query: 'I have a bad cold and runny nose' },
              { label: 'Cough / Throat', query: 'I have persistent cough and sore throat' },
              { label: 'Body Pain / Aches', query: 'I am experiencing widespread body pain and muscle ache' },
              { label: 'Headache', query: 'I have a severe throbbing headache' },
              { label: 'Stomachache', query: 'I have stomachache and abdominal cramps' },
              { label: 'Chest pain / Short breath', query: 'I have severe chest pain and cannot breathe' },
            ].map((chip) => (
              <button
                key={chip.label}
                onClick={() => handleSendMessage(chip.query)}
                className="shrink-0 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 text-slate-700 dark:text-slate-300 hover:text-teal-600 text-xs transition-colors cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-teal-600 text-white rounded-br-none'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {/* If message returned structured care steps, show summary badges */}
                  {msg.analysis && (
                    <div className="mt-3 pt-3 border-t border-slate-200/70 dark:border-slate-700/70 space-y-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Identified:
                        </span>
                        {msg.analysis.detectedSymptoms.map((sym) => (
                          <span
                            key={sym}
                            className="px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-[11px] font-semibold"
                          >
                            {sym}
                          </span>
                        ))}
                      </div>

                      {/* Immediate emergency call badge inside message if triggered */}
                      {msg.analysis.isSevere && (
                        <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-950/70 border border-red-300 dark:border-red-800 text-red-900 dark:text-red-200 text-xs flex items-center justify-between gap-2 mt-2">
                          <span className="font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                            Emergency Escalation Active
                          </span>
                          <div className="flex gap-1.5">
                            <a
                              href="tel:108"
                              className="px-2 py-1 rounded bg-red-600 text-white font-bold text-[11px] hover:bg-red-700"
                            >
                              Call 108
                            </a>
                            <a
                              href="tel:112"
                              className="px-2 py-1 rounded bg-black text-white font-bold text-[11px] hover:bg-slate-900"
                            >
                              Call 112
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-200/50 dark:border-slate-800">
                    {msg.sender === 'bot' && (
                      <button
                        type="button"
                        onClick={() => handleToggleSpeak(msg.id, msg.text)}
                        className="px-2 py-0.5 rounded-lg text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-300 cursor-pointer flex items-center gap-1.5 text-[11px] hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                        title="Listen to this guidance aloud"
                        aria-label="Read guidance aloud"
                      >
                        {speakingMsgId === msg.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                            <span className="text-red-500 font-bold text-[10px]">Stop Audio</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                            <span className="text-[10px] font-semibold text-teal-700 dark:text-teal-300">Read Aloud</span>
                          </>
                        )}
                      </button>
                    )}
                    <div
                      className={`text-[10px] ml-auto opacity-60 ${
                        msg.sender === 'user' ? 'text-teal-100' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 justify-start items-center">
                <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs animate-pulse">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-center gap-2">
                  <span className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]"></span>
                  </span>
                  <span>Analyzing clinical symptoms & guideline protocols...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar with Microphone Dictation */}
          <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              {/* Voice Dictation (Microphone) */}
              <button
                type="button"
                onClick={handleToggleDictation}
                className={`p-3 rounded-2xl transition-all cursor-pointer shadow-xs shrink-0 ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse ring-2 ring-red-400'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                }`}
                title={isListening ? 'Listening to your voice... Click to stop' : 'Click to dictate symptoms with your voice (Ideal for seniors & pain)'}
                aria-label={isListening ? 'Stop voice recording' : 'Dictate symptoms by microphone'}
              >
                {isListening ? (
                  <MicOff className="w-5 h-5 animate-pulse" />
                ) : (
                  <Mic className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                )}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isListening ? 'Listening to your voice...' : 'Describe symptoms (e.g., headache for 2 days, cold, coughing)...'}
                className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="submit"
                disabled={loading || !inputText.trim()}
                className="p-3 rounded-2xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:opacity-50 text-white shadow-md transition-all cursor-pointer shrink-0"
                aria-label="Send symptom description"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT: Clinical Triage, Protocol Checklist & Emergency Hotline (Col 5) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Risk Gauge Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-teal-600" />
                Real-Time Risk Scoring
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  latestAnalysis?.riskLevel === 'Severe'
                    ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                    : latestAnalysis?.riskLevel === 'Moderate'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                }`}
              >
                {latestAnalysis?.riskLevel || 'Normal'}
              </span>
            </div>

            {/* Score Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-500">Triage Severity Index</span>
                <span className="text-slate-900 dark:text-white font-bold">
                  {latestAnalysis ? `${latestAnalysis.riskScore}/100` : 'Awaiting input'}
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden relative">
                <div
                  className={`h-full transition-all duration-700 rounded-full ${
                    (latestAnalysis?.riskScore || 0) > 70
                      ? 'bg-red-600'
                      : (latestAnalysis?.riskScore || 0) > 35
                      ? 'bg-amber-500'
                      : 'bg-teal-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(12, latestAnalysis?.riskScore || 15))}%` }}
                />
              </div>
            </div>

            {/* Identified Symptoms */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/60">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Identified Symptoms
              </div>
              <div className="flex flex-wrap gap-1.5">
                {latestAnalysis?.detectedSymptoms?.length ? (
                  latestAnalysis.detectedSymptoms.map((sym) => (
                    <span
                      key={sym}
                      className="px-2.5 py-1 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200 text-xs font-semibold"
                    >
                      {sym}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">
                    Describe symptoms in chat to begin clinical mapping.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actionable Care Checklist (Strict Guidelines Followed) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-lg flex-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Clinical Home Care Protocol
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Check off as completed</span>
            </div>

            <div className="space-y-2 mt-3">
              {(latestAnalysis?.suggestedCareSteps?.length
                ? latestAnalysis.suggestedCareSteps
                : [
                    'Drink hot water regularly throughout the day for 1 week',
                    'Strictly avoid cold drinks, iced beverages, or ice cream',
                    'Salt water gargling 2-3 times daily for cough & throat irritation',
                    'Place a heating pad on abdomen if stomachache occurs',
                    'Ensure resting and quiet sleep for headache relief',
                    'Consult a medical doctor for body pain or persistent symptoms'
                  ]
              ).map((step, idx) => {
                const isChecked = !!completedSteps[step];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleStep(step)}
                    className={`p-3 rounded-2xl border text-xs leading-relaxed transition-all cursor-pointer flex items-start gap-2.5 ${
                      isChecked
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 line-through opacity-75'
                        : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 hover:border-teal-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 shrink-0 cursor-pointer"
                    />
                    <span>{step}</span>
                  </div>
                );
              })}
            </div>

            {/* Direct Connect with Doctors CTA */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/60 space-y-2">
              <button
                onClick={() => onOpenDoctorModal(latestAnalysis?.recommendedDoctorType, latestAnalysis?.detectedSymptoms)}
                className="w-full py-3 px-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>
                  {latestAnalysis?.recommendedDoctorType
                    ? `Consult ${latestAnalysis.recommendedDoctorType}`
                    : 'Connect with a Professional Doctor'}
                </span>
              </button>

              <button
                onClick={() => onOpenNearbyMaps?.('hospital')}
                className="w-full py-2.5 px-4 rounded-2xl border border-teal-200 dark:border-teal-800 bg-teal-50/60 dark:bg-teal-950/40 text-teal-800 dark:text-teal-200 hover:bg-teal-100 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-teal-600" />
                <span>Find Nearby Hospitals & Doctors on Google Maps</span>
              </button>
            </div>
          </div>

          {/* Direct Emergency Call 108 & 112 Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-200" />
                <h4 className="text-sm font-bold">Direct Emergency Hotline</h4>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-semibold uppercase">
                24/7 National Dispatch
              </span>
            </div>

            <p className="text-xs text-red-100 mb-3">
              Immediate tap-to-call for acute chest pain, unconsciousness, severe trauma, or acute breathing difficulty:
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              <a
                href="tel:108"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white text-red-700 hover:bg-red-50 font-black text-xs shadow-md transition-transform active:scale-95"
              >
                <PhoneCall className="w-3.5 h-3.5 text-red-600" />
                <span>Call 108 (Ambulance)</span>
              </a>

              <a
                href="tel:112"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-950 text-white hover:bg-black font-black text-xs shadow-md transition-transform active:scale-95"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Call 112 (Emergency)</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
