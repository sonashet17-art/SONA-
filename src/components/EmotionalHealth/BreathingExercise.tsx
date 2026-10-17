import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Wind, Sparkles, Heart } from 'lucide-react';

export const BreathingExercise: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'Inhale' | 'Hold (Full)' | 'Exhale' | 'Hold (Empty)'>('Inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  useEffect(() => {
    let timer: any = null;
    if (isActive) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            // transition phase
            if (phase === 'Inhale') {
              setPhase('Hold (Full)');
              return 4;
            } else if (phase === 'Hold (Full)') {
              setPhase('Exhale');
              return 4;
            } else if (phase === 'Exhale') {
              setPhase('Hold (Empty)');
              return 4;
            } else {
              setPhase('Inhale');
              setCyclesCompleted((c) => c + 1);
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, phase]);

  const handleReset = () => {
    setIsActive(false);
    setPhase('Inhale');
    setSecondsLeft(4);
    setCyclesCompleted(0);
  };

  const getCircleScale = () => {
    if (phase === 'Inhale') return 'scale-125';
    if (phase === 'Hold (Full)') return 'scale-125';
    if (phase === 'Exhale') return 'scale-90';
    return 'scale-90';
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'Inhale':
        return 'Breathe in slowly and deeply through your nose...';
      case 'Hold (Full)':
        return 'Gently hold your breath. Feel the stillness...';
      case 'Exhale':
        return 'Exhale softly through your mouth, releasing tension...';
      case 'Hold (Empty)':
        return 'Rest comfortably before the next wave...';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-900/10 via-purple-900/5 to-teal-900/10 border border-indigo-200 dark:border-indigo-800 text-center">
      <div className="flex items-center gap-2 mb-2">
        <Wind className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          4-4-4-4 Box Breathing
        </h3>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-6">
        Scientifically proven to activate the parasympathetic nervous system, lowering cortisol and racing thoughts.
      </p>

      {/* Animated Breathing Circle */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center my-4">
        {/* Outer Pulsing Glow */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/20 to-pink-500/20 blur-xl transition-all duration-1000 ${
            isActive && phase === 'Inhale' ? 'scale-125 opacity-80' : 'scale-95 opacity-40'
          }`}
        />

        {/* Breathing Orb */}
        <div
          className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white flex flex-col items-center justify-center shadow-xl transition-transform duration-[4000ms] ease-in-out ${
            isActive ? getCircleScale() : 'scale-100'
          }`}
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-100">
            {isActive ? phase : 'Ready'}
          </span>
          <span className="text-4xl font-extrabold tracking-tight mt-1">
            {isActive ? secondsLeft : '4s'}
          </span>
          <span className="text-[10px] text-indigo-200 mt-1">
            {isActive ? `Cycle #${cyclesCompleted + 1}` : 'Tap Start'}
          </span>
        </div>
      </div>

      <div className="text-xs font-medium text-slate-700 dark:text-slate-300 min-h-[24px] mb-5">
        {isActive ? getPhaseInstruction() : 'Take a comfortable seated posture with your shoulders dropped.'}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsActive(!isActive)}
          className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isActive ? 'Pause' : 'Start Breathing'}</span>
        </button>

        <button
          onClick={handleReset}
          className="p-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors cursor-pointer"
          title="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {cyclesCompleted > 0 && (
        <div className="mt-4 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          Wonderful! You completed {cyclesCompleted} relaxing {cyclesCompleted === 1 ? 'cycle' : 'cycles'}.
        </div>
      )}
    </div>
  );
};
