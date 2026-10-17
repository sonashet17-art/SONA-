import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { storage } from '../../services/storage';
import { X, User, Mail, ShieldCheck, Heart, Sparkles, LogIn, UserPlus } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUserChange: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChange,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Student' | 'Working Professional' | 'Caregiver' | 'Senior' | 'General'>('Student');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [allergies, setAllergies] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signup' && !name.trim()) return;
    if (!email.trim()) return;

    const updatedUser: UserProfile = {
      id: 'usr-' + Math.random().toString(36).substring(2, 9),
      name: mode === 'signup' ? name.trim() : (name.trim() || email.split('@')[0]),
      email: email.trim(),
      role: role,
      isGuest: false,
      emergencyContactPhone: emergencyPhone.trim() || undefined,
      medicalNotes: allergies.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    storage.setUser(updatedUser);
    onUserChange(updatedUser);
    setSuccessMsg(`Welcome, ${updatedUser.name}! Your account is now active.`);
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  const handleQuickDemo = (demoType: 'student' | 'pro') => {
    const demoUser: UserProfile = demoType === 'student'
      ? {
          id: 'demo-alex',
          name: 'Alex Chen',
          email: 'alex.chen@university.edu',
          role: 'Student',
          isGuest: false,
          emergencyContactName: 'Chen Family',
          emergencyContactPhone: '+91 98765 43210',
          medicalNotes: 'Mild dust allergy',
          createdAt: new Date().toISOString(),
        }
      : {
          id: 'demo-sarah',
          name: 'Dr. Sarah Jenkins',
          email: 'sarah.j@healthorg.com',
          role: 'Working Professional',
          isGuest: false,
          emergencyContactPhone: '+91 91234 56789',
          createdAt: new Date().toISOString(),
        };

    storage.setUser(demoUser);
    onUserChange(demoUser);
    onClose();
  };

  const handleContinueGuest = () => {
    const guestUser: UserProfile = {
      id: 'guest-' + Math.random().toString(36).substring(2, 9),
      name: 'Guest User',
      email: 'guest@auracare.internal',
      role: 'Student',
      isGuest: true,
      createdAt: new Date().toISOString(),
    };
    storage.setUser(guestUser);
    onUserChange(guestUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 transition-all">
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-indigo-600 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="mx-auto w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 shadow-inner">
            <Heart className="w-7 h-7 text-white fill-white/80" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            {mode === 'login' ? 'Sign in to AuraCare' : 'Create Your AuraCare Profile'}
          </h2>
          <p className="text-teal-100 text-xs mt-1">
            Personalize your medical symptom history & confidential emotion tracking
          </p>
        </div>

        <div className="p-6">
          {successMsg ? (
            <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200 text-center flex flex-col items-center gap-2">
              <Sparkles className="w-8 h-8 text-teal-500 animate-spin" />
              <p className="font-semibold text-sm">{successMsg}</p>
            </div>
          ) : (
            <>
              {/* Tab selector */}
              <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 mb-5">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    mode === 'login'
                      ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" /> Log In
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    mode === 'signup'
                      ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" /> Sign Up
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Maya Sharma"
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Primary Profile Role
                  </label>
                  <select
                    value={role}
                    onChange={(e: any) => setRole(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Student">Student (Exam, Academic & Daily Stress)</option>
                    <option value="Working Professional">Working Professional (Career & Burnout)</option>
                    <option value="Caregiver">Caregiver / Parent</option>
                    <option value="Senior">Senior / Elder Care</option>
                    <option value="General">General Wellness</option>
                  </select>
                </div>

                {mode === 'signup' && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Emergency Contact Phone (Optional)
                      </label>
                      <input
                        type="tel"
                        value={emergencyPhone}
                        onChange={(e) => setEmergencyPhone(e.target.value)}
                        placeholder="e.g. +91 98765 00000"
                        className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Known Drug Allergies / Notes (Optional)
                      </label>
                      <input
                        type="text"
                        value={allergies}
                        onChange={(e) => setAllergies(e.target.value)}
                        placeholder="e.g. Penicillin allergy, Asthmatic"
                        className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="w-full mt-2 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {mode === 'login' ? 'Continue with Email' : 'Complete Registration'}
                </button>
              </form>

              {/* Demo quick sign-in */}
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-2 text-center">
                  Quick Demo Access
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('student')}
                    className="p-2 text-left rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/60 dark:bg-indigo-950/30 hover:bg-indigo-100/70 transition-colors text-xs text-indigo-900 dark:text-indigo-200 font-medium flex flex-col cursor-pointer"
                  >
                    <span className="font-bold flex items-center gap-1">
                      🎓 Student Demo
                    </span>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400">
                      Alex (Midterms & Stress)
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemo('pro')}
                    className="p-2 text-left rounded-xl border border-teal-200 dark:border-teal-900/60 bg-teal-50/60 dark:bg-teal-950/30 hover:bg-teal-100/70 transition-colors text-xs text-teal-900 dark:text-teal-200 font-medium flex flex-col cursor-pointer"
                  >
                    <span className="font-bold flex items-center gap-1">
                      💼 Pro Demo
                    </span>
                    <span className="text-[10px] text-teal-600 dark:text-teal-400">
                      Dr. Sarah (Clinician/Pro)
                    </span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleContinueGuest}
                  className="w-full mt-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 font-medium text-center transition-colors cursor-pointer"
                >
                  Or continue browsing as a Guest
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
