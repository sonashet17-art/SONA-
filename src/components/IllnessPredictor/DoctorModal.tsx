import React, { useState } from 'react';
import { X, Star, Calendar, Clock, Video, Phone, CheckCircle2, ShieldCheck, Stethoscope, MapPin } from 'lucide-react';
import { VERIFIED_DOCTORS } from '../../data/mockData';
import { Doctor } from '../../types';

interface DoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendedType?: string;
  initialSymptoms?: string[];
  onOpenNearbyMaps?: (category?: 'all' | 'hospital' | 'doctor' | 'psychology') => void;
}

export const DoctorModal: React.FC<DoctorModalProps> = ({
  isOpen,
  onClose,
  recommendedType,
  initialSymptoms,
  onOpenNearbyMaps,
}) => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [consultationType, setConsultationType] = useState<'video' | 'instant'>('video');
  const [patientNotes, setPatientNotes] = useState('');

  if (!isOpen) return null;

  const handleBook = (doc: Doctor) => {
    setSelectedDoctor(doc);
    setBookingSuccess(false);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      // Keep confirmation visible briefly
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold uppercase tracking-wider">
              Clinical Teleconsultation
            </span>
            {recommendedType && (
              <span className="px-2.5 py-0.5 rounded-full bg-teal-800 text-teal-200 text-[11px] font-semibold">
                Matched Specialty: {recommendedType}
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            Connect with Professional Doctors
          </h2>
          <p className="text-teal-100 text-xs mt-1">
            Board-certified physicians available for immediate audio/video consult and valid digital prescriptions.
          </p>
        </div>

        <div className="p-6">
          {selectedDoctor ? (
            <div>
              {bookingSuccess ? (
                <div className="py-8 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Consultation Confirmed!
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mt-2">
                    You are connected with <strong>{selectedDoctor.name}</strong>. A secure tele-health room link has been generated and doctors will join within 5 minutes.
                  </p>

                  <div className="mt-5 p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-left text-xs max-w-md w-full space-y-1.5 text-teal-900 dark:text-teal-200">
                    <div><strong>Doctor:</strong> {selectedDoctor.name}</div>
                    <div><strong>Specialty:</strong> {selectedDoctor.specialty}</div>
                    <div><strong>Mode:</strong> {consultationType === 'video' ? 'Encrypted Video Call' : 'Instant Direct Phone Call'}</div>
                    <div><strong>Patient Hotline:</strong> {selectedDoctor.phone}</div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <a
                      href={`tel:${selectedDoctor.phone.replace(/\s+/g, '')}`}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md"
                    >
                      <Phone className="w-4 h-4" /> Start Direct Call
                    </a>
                    <button
                      onClick={() => setSelectedDoctor(null)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-xs cursor-pointer"
                    >
                      Browse Other Doctors
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleConfirmBooking} className="space-y-4">
                  <button
                    type="button"
                    onClick={() => setSelectedDoctor(null)}
                    className="text-xs font-semibold text-teal-600 hover:underline flex items-center gap-1 mb-2 cursor-pointer"
                  >
                    ← Back to Doctors List
                  </button>

                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                    <img
                      src={selectedDoctor.avatar}
                      alt={selectedDoctor.name}
                      className="w-14 h-14 rounded-2xl object-cover shadow-sm"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-base">
                        {selectedDoctor.name}
                      </h4>
                      <div className="text-xs text-teal-600 dark:text-teal-400 font-medium">
                        {selectedDoctor.specialty}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {selectedDoctor.hospital} • {selectedDoctor.experience}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Select Consultation Mode
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setConsultationType('video')}
                        className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer ${
                          consultationType === 'video'
                            ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 ring-2 ring-teal-500/20'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600'
                        }`}
                      >
                        <Video className="w-4 h-4 text-teal-600" />
                        Encrypted Video Call
                      </button>
                      <button
                        type="button"
                        onClick={() => setConsultationType('instant')}
                        className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer ${
                          consultationType === 'instant'
                            ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 ring-2 ring-teal-500/20'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600'
                        }`}
                      >
                        <Phone className="w-4 h-4 text-teal-600" />
                        Direct Voice Consultation
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Summary of Symptoms / Notes for Doctor
                    </label>
                    <textarea
                      rows={3}
                      value={patientNotes}
                      onChange={(e) => setPatientNotes(e.target.value)}
                      placeholder={
                        initialSymptoms?.length
                          ? `Symptoms flagged: ${initialSymptoms.join(', ')}...`
                          : 'Describe your symptoms, how long you have had them, and any medicines already taken...'
                      }
                      className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs flex items-center justify-between">
                    <span className="text-slate-500">Consultation Fee</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {selectedDoctor.fee}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Confirm & Start Tele-Consult
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Nearby Clinics on Google Maps Banner */}
              <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    Prefer in-person doctor visits or local clinics?
                  </div>
                  <div className="text-[11px] text-teal-700 dark:text-teal-300">
                    Find hospitals, polyclinics, and doctors near your GPS location.
                  </div>
                </div>
                {onOpenNearbyMaps && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenNearbyMaps('doctor');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs"
                  >
                    View on Google Maps
                  </button>
                )}
              </div>

              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Available Doctors on Call
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {VERIFIED_DOCTORS.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 hover:border-teal-400 transition-all shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={doc.avatar}
                        alt={doc.name}
                        className="w-14 h-14 rounded-2xl object-cover shadow-sm shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                            {doc.name}
                          </h4>
                          <span className="flex items-center gap-0.5 text-xs font-semibold text-amber-500">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {doc.rating}
                          </span>
                        </div>
                        <div className="text-xs font-medium text-teal-600 dark:text-teal-400">
                          {doc.specialty}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {doc.hospital} • {doc.experience}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            {doc.availableTime}
                          </span>
                          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                            {doc.fee}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col gap-2 w-full sm:w-auto shrink-0">
                      <button
                        onClick={() => handleBook(doc)}
                        className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Video className="w-3.5 h-3.5" />
                        Book Video Consult
                      </button>
                      <a
                        href={`tel:${doc.phone.replace(/\s+/g, '')}`}
                        className="flex-1 sm:flex-initial px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold text-center flex items-center justify-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        Direct Call
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
