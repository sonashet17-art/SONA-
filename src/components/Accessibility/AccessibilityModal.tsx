import React from 'react';
import { AccessibilitySettings } from '../../types';
import {
  X,
  Type,
  Eye,
  Volume2,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Heart,
  RotateCcw
} from 'lucide-react';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AccessibilitySettings;
  onChangeSettings: (settings: AccessibilitySettings) => void;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({
  isOpen,
  onClose,
  settings,
  onChangeSettings,
}) => {
  if (!isOpen) return null;

  const handleFontSizeChange = (size: 'normal' | 'large' | 'extra-large') => {
    onChangeSettings({ ...settings, fontSize: size });
  };

  const handleToggle = (key: keyof Omit<AccessibilitySettings, 'fontSize'>) => {
    onChangeSettings({ ...settings, [key]: !settings[key] });
  };

  const resetDefaults = () => {
    onChangeSettings({
      fontSize: 'normal',
      highContrast: false,
      simplifiedLanguage: false,
      screenReaderVoice: false,
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <Eye className="w-5 h-5" />
            </span>
            <div>
              <h2 id="accessibility-title" className="text-xl font-bold">
                Universal Accessibility
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tailored for every age group: seniors, students, & caregivers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close accessibility settings"
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="py-5 space-y-6">
          {/* Font Size Adjuster */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                <Type className="w-4 h-4 text-teal-600" />
                <span>Text Size & Readability</span>
              </label>
              <span className="text-xs text-teal-600 dark:text-teal-400 font-bold">
                {settings.fontSize === 'normal'
                  ? 'Standard (100%)'
                  : settings.fontSize === 'large'
                  ? 'Large for Seniors (115%)'
                  : 'Extra Large (130%)'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Increases button sizes, guidance typography, and medical instructions for comfortable reading.
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'normal', label: 'Standard', sample: 'Aa' },
                { id: 'large', label: 'Large (Seniors)', sample: 'Aa+' },
                { id: 'extra-large', label: 'Extra Large', sample: 'Aa++' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleFontSizeChange(item.id as any)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    settings.fontSize === item.id
                      ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 font-bold ring-2 ring-teal-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-lg font-extrabold">{item.sample}</span>
                  <span className="text-xs">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* High Contrast Mode */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <div className="pr-3">
              <div className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>High Contrast Mode</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Sharpens outlines, enhances text contrast, and maximizes clarity for low-vision users.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.highContrast}
              onClick={() => handleToggle('highContrast')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                settings.highContrast ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  settings.highContrast ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Easy-to-Understand / Simplified Language */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <div className="pr-3">
              <div className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                <span>Simplified Explanations (Easy Read)</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Displays medical guidance and emotional advice in plain, simple words ideal for children or seniors.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.simplifiedLanguage}
              onClick={() => handleToggle('simplifiedLanguage')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                settings.simplifiedLanguage ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  settings.simplifiedLanguage ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Speech / Voice Reader */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <div className="pr-3">
              <div className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-emerald-500" />
                <span>Text-to-Speech Voice Assistant</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Automatically reads aloud symptom care steps, emotional comfort messages, and emergency guidance.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.screenReaderVoice}
              onClick={() => handleToggle('screenReaderVoice')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                settings.screenReaderVoice ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  settings.screenReaderVoice ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={resetDefaults}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to standard</span>
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
