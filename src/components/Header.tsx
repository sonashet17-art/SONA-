import React from 'react';
import { UserProfile } from '../types';
import {
  Activity,
  Heart,
  PhoneCall,
  User,
  Sparkles,
  Bot,
  Brain,
  ShieldAlert,
  LogOut,
  Stethoscope,
  MapPin
} from 'lucide-react';

interface HeaderProps {
  currentView: 'home' | 'illness' | 'emotional' | 'maps';
  onNavigate: (view: 'home' | 'illness' | 'emotional' | 'maps') => void;
  currentUser: UserProfile;
  onOpenAuth: () => void;
  onOpenEmergency: () => void;
  onOpenDoctorModal: () => void;
  onOpenNearbyMaps: () => void;
  onOpenAccessibility: () => void;
  accessibilitySettings: import('../types').AccessibilitySettings;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  currentUser,
  onOpenAuth,
  onOpenEmergency,
  onOpenDoctorModal,
  onOpenNearbyMaps,
  onOpenAccessibility,
  accessibilitySettings,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
      {/* Top Urgent Emergency Call Bar */}
      <div className="bg-red-600 dark:bg-red-700 text-white text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="container mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span>Immediate Medical Emergency? Call National Ambulance & Police:</span>
          </div>

          <div className="flex items-center gap-2 font-bold">
            <a
              href="tel:108"
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-red-700 hover:bg-red-50 text-xs shadow-xs transition-transform active:scale-95"
            >
              <PhoneCall className="w-3 h-3 text-red-600" />
              108 (Ambulance)
            </a>
            <a
              href="tel:112"
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-950 text-white hover:bg-black text-xs shadow-xs transition-transform active:scale-95"
            >
              <ShieldAlert className="w-3 h-3 text-red-400" />
              112 (Emergency)
            </a>
            <button
              onClick={onOpenEmergency}
              className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-800/80 hover:bg-red-800 text-[11px] underline underline-offset-2 cursor-pointer"
            >
              Emergency Info & Protocol
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 text-left group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 via-emerald-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <Activity className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                Aura<span className="text-teal-600 dark:text-teal-400">Care</span>
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-teal-100 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300">
                Health AI
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              Symptom Triage & Emotional Sanctuary
            </p>
          </div>
        </button>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              currentView === 'home'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => onNavigate('illness')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'illness'
                ? 'bg-teal-600 text-white font-semibold shadow-sm shadow-teal-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/40'
            }`}
          >
            <Bot className="w-4 h-4 text-teal-500 dark:text-teal-300 group-hover:scale-110" />
            <span>Illness Predictor</span>
          </button>

          <button
            onClick={() => onNavigate('emotional')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'emotional'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm shadow-indigo-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
            }`}
          >
            <Brain className="w-4 h-4 text-indigo-500 dark:text-indigo-300" />
            <span className="hidden md:inline">Emotional Health & Tracker</span>
            <span className="md:hidden">Emotion Hub</span>
          </button>

          <button
            onClick={() => onNavigate('maps')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'maps'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm shadow-emerald-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
            }`}
          >
            <MapPin className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            <span className="hidden sm:inline">Nearby on Maps</span>
            <span className="sm:hidden">Maps</span>
          </button>
        </nav>

        {/* User Account / Auth & Doctor connect & Accessibility */}
        <div className="flex items-center gap-2">
          {/* Universal Accessibility Button */}
          <button
            onClick={onOpenAccessibility}
            title="Universal Accessibility & Text Size for all ages"
            aria-label="Universal Accessibility Settings"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <span className="font-bold text-[13px] text-teal-600 dark:text-teal-400">Aa</span>
            <span className="hidden xl:inline text-[11px]">
              {accessibilitySettings.fontSize === 'normal'
                ? 'Text 100%'
                : accessibilitySettings.fontSize === 'large'
                ? 'Large (115%)'
                : 'XL (130%)'}
            </span>
          </button>

          <button
            onClick={onOpenDoctorModal}
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-teal-50/70 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 hover:bg-teal-100 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Stethoscope className="w-3.5 h-3.5" />
            Doctors Directory
          </button>

          {currentUser.isGuest ? (
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In / Login</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 transition-colors text-left cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-teal-500 text-white flex items-center justify-center font-bold text-xs">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block leading-tight">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white max-w-[100px] truncate">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">
                    {currentUser.role}
                  </div>
                </div>
              </button>

              <button
                onClick={onLogout}
                title="Sign Out"
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
