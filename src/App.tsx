import React, { useState, useEffect } from 'react';
import { UserProfile, AccessibilitySettings } from './types';
import { storage } from './services/storage';
import { Header } from './components/Header';
import { WelcomeScreen } from './components/WelcomeScreen';
import { IllnessPredictor } from './components/IllnessPredictor/IllnessPredictor';
import { EmotionalHealth } from './components/EmotionalHealth/EmotionalHealth';
import { NearbyProfessionalsMap } from './components/Maps/NearbyProfessionalsMap';
import { AuthModal } from './components/Auth/AuthModal';
import { DoctorModal } from './components/IllnessPredictor/DoctorModal';
import { EmergencyAlertModal } from './components/IllnessPredictor/EmergencyAlertModal';
import { PsychologistModal } from './components/EmotionalHealth/PsychologistModal';
import { AccessibilityModal } from './components/Accessibility/AccessibilityModal';
import { ShieldAlert, Heart, Activity, Eye, Volume2 } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'illness' | 'emotional' | 'maps'>('home');
  const [mapsCategory, setMapsCategory] = useState<'all' | 'hospital' | 'doctor' | 'psychology'>('all');
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => storage.getUser());
  const [initialPrompt, setInitialPrompt] = useState<string | undefined>(undefined);

  // Accessibility State for all ages (Seniors, Students, Visually Impaired)
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>(() =>
    storage.getAccessibilitySettings()
  );
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);

  // Google Maps Quota Handling
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuota = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  const handleUpdateAccessibility = (newSettings: AccessibilitySettings) => {
    setAccessibilitySettings(newSettings);
    storage.saveAccessibilitySettings(newSettings);
  };

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [emergencyReason, setEmergencyReason] = useState<string | undefined>(undefined);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [doctorSpecialty, setDoctorSpecialty] = useState<string | undefined>(undefined);
  const [doctorSymptoms, setDoctorSymptoms] = useState<string[] | undefined>(undefined);
  const [isPsychologistModalOpen, setIsPsychologistModalOpen] = useState(false);

  const handleNavigate = (view: 'home' | 'illness' | 'emotional' | 'maps', prompt?: string) => {
    setInitialPrompt(prompt);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenNearbyMaps = (category: 'all' | 'hospital' | 'doctor' | 'psychology' = 'all') => {
    setMapsCategory(category);
    setCurrentView('maps');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDoctorModal = (specialty?: string, symptoms?: string[]) => {
    setDoctorSpecialty(specialty);
    setDoctorSymptoms(symptoms);
    setIsDoctorModalOpen(true);
  };

  const handleOpenEmergency = (reason?: string) => {
    setEmergencyReason(reason);
    setIsEmergencyOpen(true);
  };

  const handleLogout = () => {
    const guest = storage.logoutUser();
    setCurrentUser(guest);
  };

  // Dynamic accessibility styles
  const fontSizeClass =
    accessibilitySettings.fontSize === 'extra-large'
      ? 'text-lg leading-relaxed'
      : accessibilitySettings.fontSize === 'large'
      ? 'text-base leading-relaxed'
      : 'text-sm leading-normal';

  const highContrastClass = accessibilitySettings.highContrast
    ? 'contrast-125 font-medium [text-shadow:_0_0.5px_0_rgb(0_0_0_/_20%)]'
    : '';

  return (
    <div
      className={`min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-teal-500 selection:text-white transition-all ${fontSizeClass} ${highContrastClass}`}
    >
      {/* Google Maps Quota Exhaustion Banner (Tier 1 & Tier 2 Quota Defense) */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Top Navigation */}
      <Header
        currentView={currentView}
        onNavigate={(v) => handleNavigate(v)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenEmergency={() => handleOpenEmergency()}
        onOpenDoctorModal={() => handleOpenDoctorModal()}
        onOpenNearbyMaps={() => handleOpenNearbyMaps('all')}
        onOpenAccessibility={() => setIsAccessibilityOpen(true)}
        accessibilitySettings={accessibilitySettings}
        onLogout={handleLogout}
      />

      {/* Universal Senior/Age Accessibility Quick Indicator Bar if customized */}
      {(accessibilitySettings.fontSize !== 'normal' ||
        accessibilitySettings.highContrast ||
        accessibilitySettings.screenReaderVoice ||
        accessibilitySettings.simplifiedLanguage) && (
        <div className="bg-teal-700 text-white px-4 py-1.5 text-xs flex items-center justify-between shadow-xs">
          <div className="container mx-auto flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Eye className="w-3.5 h-3.5 text-teal-200" />
              <span className="font-semibold">
                Accessibility Active: {accessibilitySettings.fontSize.toUpperCase()} text
                {accessibilitySettings.highContrast && ' • High Contrast'}
                {accessibilitySettings.simplifiedLanguage && ' • Plain Language'}
                {accessibilitySettings.screenReaderVoice && ' • Voice Assistance'}
              </span>
            </div>
            <button
              onClick={() => setIsAccessibilityOpen(true)}
              className="underline text-[11px] font-bold text-teal-100 hover:text-white cursor-pointer"
            >
              Adjust Settings
            </button>
          </div>
        </div>
      )}

      {/* Main Body Content with Smooth Navigation */}
      <main className="flex-1 pb-16">
        {currentView === 'home' && (
          <WelcomeScreen
            onSelectModule={(mod, prompt) => handleNavigate(mod, prompt)}
            onOpenEmergency={() => handleOpenEmergency()}
            onOpenDoctorModal={() => handleOpenDoctorModal()}
            onOpenNearbyMaps={(cat) => handleOpenNearbyMaps(cat || 'all')}
          />
        )}

        {currentView === 'illness' && (
          <IllnessPredictor
            currentUser={currentUser}
            initialPrompt={initialPrompt}
            onOpenDoctorModal={handleOpenDoctorModal}
            onOpenEmergencyModal={handleOpenEmergency}
            onOpenNearbyMaps={(cat) => handleOpenNearbyMaps(cat || 'hospital')}
            accessibilitySettings={accessibilitySettings}
          />
        )}

        {currentView === 'emotional' && (
          <EmotionalHealth
            currentUser={currentUser}
            initialPrompt={initialPrompt}
            onOpenPsychologistModal={() => setIsPsychologistModalOpen(true)}
            onOpenNearbyMaps={(cat) => handleOpenNearbyMaps(cat || 'psychology')}
            accessibilitySettings={accessibilitySettings}
          />
        )}

        {currentView === 'maps' && (
          <NearbyProfessionalsMap
            initialCategory={mapsCategory}
            onClose={() => setCurrentView('home')}
            accessibilitySettings={accessibilitySettings}
          />
        )}
      </main>

      {/* Medical & Wellness Footer */}
      <footer className="w-full py-8 border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-xs text-slate-500 dark:text-slate-400">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-600" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              AuraCare Health & Emotional Companion
            </span>
            <span>• Google Maps Grounded Healthcare Access</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAccessibilityOpen(true)}
              className="hover:underline flex items-center gap-1 text-teal-700 dark:text-teal-300 font-semibold cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Universal Accessibility for All Ages</span>
            </button>
            <span>•</span>
            <span className="text-[11px]">Emergency: 108 / 112</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onUserChange={setCurrentUser}
      />

      <DoctorModal
        isOpen={isDoctorModalOpen}
        onClose={() => setIsDoctorModalOpen(false)}
        recommendedType={doctorSpecialty}
        initialSymptoms={doctorSymptoms}
        onOpenNearbyMaps={(cat) => handleOpenNearbyMaps(cat || 'doctor')}
      />

      <EmergencyAlertModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        triggerReason={emergencyReason}
      />

      <PsychologistModal
        isOpen={isPsychologistModalOpen}
        onClose={() => setIsPsychologistModalOpen(false)}
        onOpenNearbyMaps={(cat) => handleOpenNearbyMaps(cat || 'psychology')}
      />

      <AccessibilityModal
        isOpen={isAccessibilityOpen}
        onClose={() => setIsAccessibilityOpen(false)}
        settings={accessibilitySettings}
        onChangeSettings={handleUpdateAccessibility}
      />
    </div>
  );
}
