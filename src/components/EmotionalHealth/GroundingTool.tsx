import React, { useState } from 'react';
import { Eye, Hand, Volume2, Flower2, Heart, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    step: 5,
    title: '5 Things You Can SEE',
    icon: Eye,
    instruction: 'Look around your room or space. Notice 5 distinct objects, patterns, or colors you see (e.g. lamp, pattern on wood, window frame, book, shadow).',
    color: 'from-blue-500 to-cyan-500',
    placeholder: 'Enter 5 things you see right now...',
  },
  {
    step: 4,
    title: '4 Things You Can FEEL / TOUCH',
    icon: Hand,
    instruction: 'Notice 4 physical textures (e.g. the fabric of your shirt, the cool desk surface, the weight of your feet on the floor, your hair).',
    color: 'from-teal-500 to-emerald-500',
    placeholder: 'Enter 4 things you can physically touch...',
  },
  {
    step: 3,
    title: '3 Things You Can HEAR',
    icon: Volume2,
    instruction: 'Close your eyes for 5 seconds. Tune into 3 sounds (e.g. distant traffic, fan whirring, birds outside, your own breath).',
    color: 'from-amber-500 to-orange-500',
    placeholder: 'Enter 3 sounds you can perceive...',
  },
  {
    step: 2,
    title: '2 Things You Can SMELL',
    icon: Flower2,
    instruction: 'Notice 2 scents in the air (e.g. coffee, fresh breeze, laundry detergent, or imagine your favorite calming scent like lavender).',
    color: 'from-purple-500 to-pink-500',
    placeholder: 'Enter 2 scents around you or comforting memories...',
  },
  {
    step: 1,
    title: '1 Thing You Can TASTE or APPRECIATE',
    icon: Heart,
    instruction: 'Notice the lingering taste of mint or tea, or state one genuine positive appreciation about yourself for showing up today.',
    color: 'from-rose-500 to-red-500',
    placeholder: 'One positive affirmation about yourself...',
  },
];

export const GroundingTool: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [userNotes, setUserNotes] = useState<Record<number, string>>({});

  const current = STEPS[currentStepIndex];
  const Icon = current.icon;
  const isFinished = completedSteps.length === 5;

  const handleNext = () => {
    if (!completedSteps.includes(currentStepIndex)) {
      setCompletedSteps((prev) => [...prev, currentStepIndex]);
    }
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setCompletedSteps([]);
    setUserNotes({});
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>5-4-3-2-1 Sensory Grounding</span>
          </h3>
          <p className="text-xs text-slate-500">
            Rapidly redirects anxious mental loops back into the physical present.
          </p>
        </div>
        <button
          onClick={handleReset}
          className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center gap-2 mb-6">
        {STEPS.map((s, idx) => {
          const isDone = completedSteps.includes(idx);
          const isCurrent = currentStepIndex === idx;
          return (
            <button
              key={s.step}
              onClick={() => setCurrentStepIndex(idx)}
              className={`flex-1 h-2 rounded-full transition-all cursor-pointer ${
                isDone
                  ? 'bg-emerald-500'
                  : isCurrent
                  ? 'bg-indigo-600 ring-2 ring-indigo-400/40'
                  : 'bg-slate-200 dark:bg-slate-700'
              }`}
              title={s.title}
            />
          );
        })}
      </div>

      {isFinished ? (
        <div className="py-8 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white">
            Sensory Grounding Complete!
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mt-1 mb-5">
            You anchored yourself into the present reality. Notice how your breathing and heart rate have stabilized.
          </p>
          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md cursor-pointer"
          >
            Practice Again
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <div
              className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${current.color} text-white flex items-center justify-center shrink-0 shadow-md`}
            >
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Step {5 - currentStepIndex} of 5
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {current.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                {current.instruction}
              </p>
            </div>
          </div>

          <textarea
            rows={2}
            value={userNotes[currentStepIndex] || ''}
            onChange={(e) =>
              setUserNotes((prev) => ({ ...prev, [currentStepIndex]: e.target.value }))
            }
            placeholder={current.placeholder}
            className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400">
              Take your time to truly observe each sense.
            </span>
            <button
              onClick={handleNext}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>{currentStepIndex === STEPS.length - 1 ? 'Finish Grounding' : 'Next Step'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
