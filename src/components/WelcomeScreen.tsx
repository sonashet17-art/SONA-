import React from 'react';
import {
  BotDoctorHandshakeIllustration,
  BotStudentComfortIllustration,
} from './Illustrations';
import {
  Stethoscope,
  HeartHandshake,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  PhoneCall,
  Activity,
  CheckCircle2,
  Brain,
  FileText,
  TrendingUp,
  UserCheck,
  MapPin
} from 'lucide-react';

interface WelcomeScreenProps {
  onSelectModule: (module: 'illness' | 'emotional', initialPrompt?: string) => void;
  onOpenEmergency: () => void;
  onOpenDoctorModal: () => void;
  onOpenNearbyMaps: (category?: 'all' | 'hospital' | 'doctor' | 'psychology') => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onSelectModule,
  onOpenEmergency,
  onOpenDoctorModal,
  onOpenNearbyMaps,
}) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
      {/* Hero Welcome Header */}
      <div className="text-center max-w-3xl mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-teal-500 animate-pulse" />
          <span>Integrated Medical AI & Mental Sanctuary</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          How can I help you today?
        </h1>

        <p className="mt-3.5 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          Choose a care module below. Whether you need structured clinical guidance for physical symptoms or a safe, private space to navigate stress and emotions, AuraCare is here for you.
        </p>
      </div>

      {/* Two Distinct Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 w-full">
        {/* CARD 1: Illness Predictor */}
        <div className="group relative flex flex-col rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 p-6 sm:p-8 shadow-xl hover:shadow-2xl hover:border-teal-400 dark:hover:border-teal-500 transition-all duration-300">
          <div className="flex items-center justify-between gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
              Module 1 • Physical Health
            </span>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Clinical Guidelines
            </span>
          </div>

          {/* Visual/Icon: A bot handshaking a doctor */}
          <div className="mb-5">
            <BotDoctorHandshakeIllustration />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
            Illness Predictor
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-sm mt-2 leading-relaxed">
            Designed for symptom-based and seasonal illness prediction to give preliminary guidance. Features an interactive AI bot that evaluates symptoms according to verified medical protocols, maps risk scores, and connects you instantly with verified doctors.
          </p>

          {/* Key Guidelines preview */}
          <div className="my-5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs space-y-2 text-slate-600 dark:text-slate-300">
            <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
              Strict Protocol Coverage:
            </div>
            <ul className="grid grid-cols-1 gap-1 text-[12px] text-slate-600 dark:text-slate-400">
              <li>💧 <strong>Cold:</strong> Hot water for a week, strictly no cold drinks/ice cream</li>
              <li>🧂 <strong>Cough:</strong> Hot water, salt water gargling, and warm lime water</li>
              <li>🩺 <strong>Body Pain:</strong> Medical doctor consult & recommended medicines</li>
              <li>🛌 <strong>Headache:</strong> Rest & sound sleep; severe requires doctor evaluation</li>
              <li>♨️ <strong>Stomachache:</strong> Abdominal heating pad & doctor prescribed care</li>
              <li>🚨 <strong>Severe/High-Risk:</strong> Instant 108 & 112 emergency escalation</li>
            </ul>
          </div>

          <div className="mt-auto pt-4 flex flex-col gap-3">
            <button
              onClick={() => onSelectModule('illness')}
              className="w-full py-3.5 px-6 rounded-2xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-sm shadow-md shadow-teal-600/25 transition-all flex items-center justify-center gap-2 group-hover:gap-3 cursor-pointer"
            >
              <span>Launch Illness Predictor Bot</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => onOpenNearbyMaps('hospital')}
              className="w-full py-2 px-3 rounded-xl border border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300 hover:bg-teal-100/70 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              <span>Find Nearby Hospitals & Doctors on Google Maps</span>
            </button>

            {/* Quick symptom jump buttons */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 self-center mr-1">Quick check:</span>
              {['Cold & Congestion', 'Cough & Throat', 'Body Pain', 'Headache', 'Stomachache'].map((sym) => (
                <button
                  key={sym}
                  onClick={() => onSelectModule('illness', `I have symptoms of ${sym}. What should I do?`)}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-100 dark:bg-slate-700/60 hover:bg-teal-50 dark:hover:bg-teal-950/60 text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-300 transition-colors cursor-pointer"
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CARD 2: Emotional Health Care & Emotion Tracker */}
        <div className="group relative flex flex-col rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 p-6 sm:p-8 shadow-xl hover:shadow-2xl hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-300">
          <div className="flex items-center justify-between gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
              Module 2 • Mental Sanctuary
            </span>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
              <HeartHandshake className="w-3.5 h-3.5" /> Confidential & Caring
            </span>
          </div>

          {/* Visual/Icon: A bot comforting a student */}
          <div className="mb-5">
            <BotStudentComfortIllustration />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            Emotional Health Care & Emotion Tracker
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-sm mt-2 leading-relaxed">
            Designed as a private outlet to process daily stress and anxiety. Features an interactive chatbot that talks, comforts, and motivates the user, analyzes journal inputs for stress patterns, provides positive coping mechanisms, and includes a visual progress tracker, a journaling feature, and a direct link to connect with professional psychologists.
          </p>

          {/* Module features preview */}
          <div className="my-5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs space-y-2 text-slate-600 dark:text-slate-300">
            <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-indigo-600" />
              Integrated Emotional Toolkit:
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[12px] text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                <span>Empathetic Comfort AI Chat</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                <span>AI Journal Stress Pattern Analysis</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                <span>Box Breathing & 5-4-3-2-1 Grounding</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                <span>Visual Mood & Stress Trend Graph</span>
              </li>
              <li className="flex items-center gap-1.5 sm:col-span-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                <span>Direct Verified Psychologist & Tele-MANAS link</span>
              </li>
            </ul>
          </div>

          <div className="mt-auto pt-4 flex flex-col gap-3">
            <button
              onClick={() => onSelectModule('emotional')}
              className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 group-hover:gap-3 cursor-pointer"
            >
              <span>Open Emotional Health & Tracker</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => onOpenNearbyMaps('psychology')}
              className="w-full py-2 px-3 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100/70 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
              <span>Find Nearby Psychology Clinics on Google Maps</span>
            </button>

            {/* Quick emotional prompts */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 self-center mr-1">Quick start:</span>
              {[
                'I am feeling stressed about exams',
                'Feeling overwhelmed today',
                'Write new journal entry',
                'Guided Breathing'
              ].map((act) => (
                <button
                  key={act}
                  onClick={() => onSelectModule('emotional', act)}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-100 dark:bg-slate-700/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-pointer"
                >
                  {act}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency & Doctor Teleconsult Quick Bar */}
      <div className="w-full mt-10 p-5 rounded-3xl bg-gradient-to-r from-red-500/10 via-amber-500/5 to-teal-500/10 border border-red-200 dark:border-red-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Emergency & Clinical Escalation Hotline
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              For acute distress, trauma, or severe symptoms, immediate emergency dispatch is available 24/7.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <a
            href="tel:108"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-transform active:scale-95"
          >
            <PhoneCall className="w-3.5 h-3.5" /> Call 108
          </a>
          <a
            href="tel:112"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 dark:bg-black hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-transform active:scale-95"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" /> Call 112
          </a>
          <button
            onClick={() => onOpenNearbyMaps('all')}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-transform active:scale-95 cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5" /> Nearby on Google Maps
          </button>
          <button
            onClick={onOpenDoctorModal}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md transition-transform active:scale-95 cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5" /> Find Doctors
          </button>
        </div>
      </div>
    </div>
  );
};
