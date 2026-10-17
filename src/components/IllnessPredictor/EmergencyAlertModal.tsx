import React from 'react';
import { X, PhoneCall, AlertTriangle, ShieldAlert, HeartPulse, MapPin } from 'lucide-react';
import { HELPLINES } from '../../data/mockData';

interface EmergencyAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerReason?: string;
}

export const EmergencyAlertModal: React.FC<EmergencyAlertModalProps> = ({
  isOpen,
  onClose,
  triggerReason,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border-2 border-red-500 transition-all">
        {/* Pulsing Alert Top */}
        <div className="bg-red-600 p-6 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-radial from-red-500 to-red-700 opacity-60"></div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-white text-red-600 flex items-center justify-center shadow-lg mb-3 animate-bounce">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black tracking-tight">
              Emergency Medical Alert
            </h2>
            <p className="text-red-100 text-xs mt-1 max-w-sm">
              {triggerReason || 'Severe or high-risk symptoms detected. Immediate professional intervention is strongly advised.'}
            </p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Direct Urgent Call Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="tel:108"
              className="flex items-center justify-between p-4 rounded-2xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-lg shadow-red-600/30 transition-all group"
            >
              <div>
                <div className="text-[11px] uppercase tracking-wider font-semibold opacity-90">
                  National Ambulance
                </div>
                <div className="text-3xl font-black tracking-tight flex items-center gap-2">
                  <span>108</span>
                </div>
                <div className="text-[11px] opacity-80 mt-0.5">Free Medical Dispatch</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <PhoneCall className="w-5 h-5" />
              </div>
            </a>

            <a
              href="tel:112"
              className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 hover:bg-black active:bg-slate-950 text-white shadow-lg transition-all group"
            >
              <div>
                <div className="text-[11px] uppercase tracking-wider font-semibold opacity-90">
                  All Emergency
                </div>
                <div className="text-3xl font-black tracking-tight">
                  112
                </div>
                <div className="text-[11px] opacity-80 mt-0.5">Police & Ambulance</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-red-600/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
            </a>
          </div>

          {/* Critical First-Aid Guidance While Waiting */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200">
            <div className="font-bold mb-1.5 flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
              <HeartPulse className="w-4 h-4 text-red-500" />
              While Help Is On The Way:
            </div>
            <ul className="list-disc pl-4 space-y-1 text-slate-700 dark:text-slate-300">
              <li>Stay calm and keep the patient resting comfortably in a seated or reclining position.</li>
              <li>Loosen any tight clothing around the neck, chest, and waist.</li>
              <li>Do not administer solid foods or unprescribed oral medication if breathing is labored.</li>
              <li>Have someone wait at the main entrance or gate to guide emergency responders.</li>
            </ul>
          </div>

          {/* Additional Helplines */}
          <div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              National Support Lines
            </div>
            <div className="space-y-1.5">
              {HELPLINES.slice(2).map((h) => (
                <div
                  key={h.number}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                >
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {h.name}
                    </div>
                    <div className="text-[11px] text-slate-500">{h.service}</div>
                  </div>
                  <a
                    href={`tel:${h.number.replace(/\s+/g, '')}`}
                    className="px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold flex items-center gap-1 text-xs"
                  >
                    <PhoneCall className="w-3 h-3" />
                    {h.number}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition-colors cursor-pointer"
          >
            Close Emergency Notification
          </button>
        </div>
      </div>
    </div>
  );
};
