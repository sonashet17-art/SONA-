import React, { useState } from 'react';
import { X, Star, Calendar, Clock, Phone, Heart, CheckCircle2, ShieldCheck, MessageSquare, MapPin } from 'lucide-react';
import { VERIFIED_PSYCHOLOGISTS, HELPLINES } from '../../data/mockData';
import { Psychologist } from '../../types';

interface PsychologistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenNearbyMaps?: (category?: 'all' | 'hospital' | 'doctor' | 'psychology') => void;
}

export const PsychologistModal: React.FC<PsychologistModalProps> = ({ isOpen, onClose, onOpenNearbyMaps }) => {
  const [selectedPsy, setSelectedPsy] = useState<Psychologist | null>(null);
  const [booked, setBooked] = useState(false);
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setBooked(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold uppercase tracking-wider">
              Psychological Care & Counseling
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-900 text-indigo-200 text-[11px] font-semibold">
              100% Confidential
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            Connect with Professional Psychologists
          </h2>
          <p className="text-indigo-100 text-xs mt-1">
            Empathetic, licensed therapists specializing in student stress, burnout, anxiety, and emotional resilience.
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Free 24/7 National Crisis Lines Callout */}
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                Tele-MANAS & Vandrevala Free Helplines
              </div>
              <div className="text-[11px] text-indigo-700 dark:text-indigo-300 mt-0.5">
                Need immediate compassionate human support right now? Free 24/7 government & foundation psychological aid.
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href="tel:14416"
                className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs"
              >
                <Phone className="w-3 h-3" /> 14416 (Tele-MANAS)
              </a>
              <a
                href="tel:9999666555"
                className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs"
              >
                <Phone className="w-3 h-3" /> Vandrevala
              </a>
            </div>
          </div>

          {/* Nearby Psychology Clinics on Google Maps Banner */}
          {onOpenNearbyMaps && (
            <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between gap-3 text-xs">
              <div>
                <div className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                  Looking for nearby in-person psychology clinics?
                </div>
                <div className="text-[11px] text-indigo-700 dark:text-indigo-300">
                  Find physical counseling clinics and therapy centers near your GPS location.
                </div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenNearbyMaps('psychology');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs"
              >
                View on Google Maps
              </button>
            </div>
          )}

          {selectedPsy ? (
            <div>
              {booked ? (
                <div className="py-8 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Counseling Session Reserved
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mt-1 mb-5">
                    Your appointment with <strong>{selectedPsy.name}</strong> is scheduled. An encrypted counseling link has been sent to your email.
                  </p>
                  <div className="flex gap-2">
                    <a
                      href={`tel:${selectedPsy.phone.replace(/\s+/g, '')}`}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" /> Direct Call
                    </a>
                    <button
                      onClick={() => {
                        setSelectedPsy(null);
                        setBooked(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs cursor-pointer"
                    >
                      Browse Therapists
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleConfirm} className="space-y-4">
                  <button
                    type="button"
                    onClick={() => setSelectedPsy(null)}
                    className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    ← Back to All Psychologists
                  </button>

                  <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <img
                      src={selectedPsy.avatar}
                      alt={selectedPsy.name}
                      className="w-14 h-14 rounded-2xl object-cover shadow-sm shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                        {selectedPsy.name}
                      </h4>
                      <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                        {selectedPsy.title}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {selectedPsy.qualifications} • {selectedPsy.experience}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      What would you like to process or work on?
                    </label>
                    <textarea
                      rows={3}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="e.g. Exam pressure, feeling unmotivated, relationship boundary issues, panic moments..."
                      className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs flex justify-between items-center">
                    <span className="text-slate-500">Session Fee</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {selectedPsy.sessionFee}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Confirm Confidential Booking
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="space-y-3.5">
              <div className="text-xs font-semibold text-slate-500">
                Verified Clinical Psychologists & Counselors
              </div>

              {VERIFIED_PSYCHOLOGISTS.map((psy) => (
                <div
                  key={psy.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-400 transition-all shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <img
                      src={psy.avatar}
                      alt={psy.name}
                      className="w-14 h-14 rounded-2xl object-cover shadow-sm shrink-0 mt-0.5"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                          {psy.name}
                        </h4>
                        <span className="flex items-center gap-0.5 text-xs font-semibold text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {psy.rating}
                        </span>
                      </div>
                      <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                        {psy.title}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 italic">
                        "{psy.approach}"
                      </p>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {psy.focusAreas.map((area) => (
                          <span
                            key={area}
                            className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-semibold"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2 w-full sm:w-auto shrink-0">
                    <button
                      onClick={() => setSelectedPsy(psy)}
                      className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" /> Book Session
                    </button>
                    <a
                      href={`tel:${psy.phone.replace(/\s+/g, '')}`}
                      className="flex-1 sm:flex-initial px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-xs font-semibold text-center flex items-center justify-center gap-1"
                    >
                      <Phone className="w-3 h-3" /> Direct Call
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
