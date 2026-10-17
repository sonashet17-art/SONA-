import React, { useState } from 'react';
import { AccessibilitySettings } from '../../types';
import {
  Type,
  Sun,
  Eye,
  Volume2,
  VolumeX,
  User,
  Sparkles,
  HelpCircle,
  X,
  Keyboard,
  Baby,
  GraduationCap,
  Briefcase,
  Heart
} from 'lucide-react';

interface AccessibilityBarProps {
  settings: AccessibilitySettings;
  onUpdateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
}

export const AccessibilityBar: React.FC<AccessibilityBarProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const handleAgeSelect = (group: AccessibilitySettings['ageGroup']) => {
    if (group === 'senior') {
      onUpdateSettings({
        ageGroup: group,
        fontSize: 'xlarge',
        highContrast: true,
        simplifiedMode: true,
      });
    } else if (group === 'child') {
      onUpdateSettings({
        ageGroup: group,
        fontSize: 'large',
        simplifiedMode: true,
      });
    } else if (group === 'student') {
      onUpdateSettings({
        ageGroup: group,
        fontSize: 'normal',
        simplifiedMode: false,
      });
    } else {
      onUpdateSettings({
        ageGroup: group,
        fontSize: 'normal',
      });
    }
  };

  return (
    <div
      role="region"
      aria-label="Universal Accessibility Toolbar"
      className="w-full bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-xs px-4 py-1.5 transition-colors"
    >
      <div className="container mx-auto flex items-center justify-between flex-wrap gap-2">
        {/* Left: Quick Access Mode indicators */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 text-[11px] uppercase tracking-wider">
            <Eye className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            Universal Care (All Ages):
          </span>

          {/* Age Selection Quick Pills */}
          <div className="inline-flex rounded-lg bg-slate-200 dark:bg-slate-800 p-0.5 text-[11px]">
            {[
              { id: 'child', label: 'Child (6-12)', icon: Baby },
              { id: 'student', label: 'Student / Teen', icon: GraduationCap },
              { id: 'adult', label: 'Adult (18-59)', icon: Briefcase },
              { id: 'senior', label: 'Senior (60+)', icon: Heart },
            ].map((g) => {
              const Icon = g.icon;
              const active = settings.ageGroup === g.id;
              return (
                <button
                  type="button"
                  key={g.id}
                  onClick={() => handleAgeSelect(g.id as any)}
                  aria-pressed={active}
                  className={`px-2 py-0.5 rounded-md font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                    active
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{g.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Font Size, High Contrast, Audio Reader toggles */}
        <div className="flex items-center gap-2.5">
          {/* Font Size controls */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 px-1 font-semibold flex items-center gap-0.5">
              <Type className="w-3 h-3" /> Size:
            </span>
            <button
              type="button"
              onClick={() => onUpdateSettings({ fontSize: 'normal' })}
              aria-label="Normal Font Size"
              title="Standard text size"
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                settings.fontSize === 'normal'
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              A
            </button>
            <button
              type="button"
              onClick={() => onUpdateSettings({ fontSize: 'large' })}
              aria-label="Large Font Size"
              title="Comfortable reading size"
              className={`px-1.5 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                settings.fontSize === 'large'
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              A+
            </button>
            <button
              type="button"
              onClick={() => onUpdateSettings({ fontSize: 'xlarge' })}
              aria-label="Extra Large Font Size for Seniors"
              title="Senior high-legibility size"
              className={`px-1.5 py-0.5 rounded text-xs font-black cursor-pointer ${
                settings.fontSize === 'xlarge'
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              A++
            </button>
          </div>

          {/* High Contrast Mode Toggle */}
          <button
            type="button"
            onClick={() => onUpdateSettings({ highContrast: !settings.highContrast })}
            aria-pressed={settings.highContrast}
            title="Toggle High Contrast for vision comfort"
            className={`px-2 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
              settings.highContrast
                ? 'bg-black text-amber-300 border-amber-400 ring-2 ring-amber-400/30'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <Sun className="w-3 h-3" />
            <span className="hidden sm:inline">High Contrast</span>
          </button>

          {/* Audio Auto-Read Aloud Toggle */}
          <button
            type="button"
            onClick={() => onUpdateSettings({ autoSpeak: !settings.autoSpeak })}
            aria-pressed={settings.autoSpeak}
            title="Toggle Audio Read-Aloud for seniors and speech assistance"
            className={`px-2 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
              settings.autoSpeak
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            {settings.autoSpeak ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
            <span className="hidden sm:inline">Audio Narrator</span>
          </button>

          {/* Shortcuts Info button */}
          <button
            type="button"
            onClick={() => setShowShortcuts(!showShortcuts)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
            title="Accessibility assistance & shortcuts"
            aria-label="Keyboard Shortcuts & Accessibility Info"
          >
            <Keyboard className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts Dialog */}
      {showShortcuts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowShortcuts(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Close shortcuts"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
            <div className="flex items-center gap-2 mb-3 text-teal-600 font-bold text-sm">
              <Keyboard className="w-5 h-5" />
              <span>Universal Accessibility Features</span>
            </div>
            <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-300">
              <li>🎙️ <strong>Voice Dictation:</strong> Tap the microphone icon in any chat or search bar to speak instead of typing.</li>
              <li>🔊 <strong>Audio Narration:</strong> Tap the speaker icon on any message or checklist to listen out loud.</li>
              <li>👵 <strong>Senior Mode (A++):</strong> Enlarges font by 40% and simplifies navigation.</li>
              <li>🎨 <strong>High Contrast:</strong> Sharper visual borders for low-vision support.</li>
              <li>🚨 <strong>Immediate Calls:</strong> One-tap 108 (Ambulance) and 112 (All-in-one Emergency).</li>
            </ul>
            <button
              type="button"
              onClick={() => setShowShortcuts(false)}
              className="w-full mt-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
