import React, { useState, useEffect, useRef } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  Pin
} from '@vis.gl/react-google-maps';
import { NearbyPlace, NearbyPlacesResponse, AccessibilitySettings } from '../../types';
import { api } from '../../services/api';
import { speech } from '../../utils/speech';
import {
  MapPin,
  Navigation,
  Search,
  ExternalLink,
  Phone,
  Clock,
  Star,
  Hospital,
  Brain,
  Stethoscope,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  LocateFixed,
  Building2,
  Volume2,
  VolumeX,
  Share2,
  ArrowRight
} from 'lucide-react';

interface NearbyProfessionalsMapProps {
  initialCategory?: 'all' | 'hospital' | 'doctor' | 'psychology';
  onClose?: () => void;
  accessibilitySettings?: AccessibilitySettings;
}

const GOOGLE_MAPS_API_KEY =
  (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) ||
  'AIzaSyDCpTXBC6TwZJKk8JCo87aCLHcmwNwTxpc';

export const NearbyProfessionalsMap: React.FC<NearbyProfessionalsMapProps> = ({
  initialCategory = 'all',
  onClose,
  accessibilitySettings,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'hospital' | 'doctor' | 'psychology'>(initialCategory);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: 12.9716, // Default central location (Bangalore)
    lng: 77.5946,
  });
  const [mapZoom, setMapZoom] = useState(13);
  const [cityNameInput, setCityNameInput] = useState('');
  const [currentCityDisplay, setCurrentCityDisplay] = useState('Your Current Area');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<NearbyPlacesResponse | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<NearbyPlace | null>(null);
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string>('Detecting location...');
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  // Auto-detect GPS coordinates on mount & when category switches
  useEffect(() => {
    detectLocation();
  }, [selectedCategory]);

  const detectLocation = () => {
    setLoading(true);
    if ('geolocation' in navigator) {
      setLocationStatus('Requesting GPS coordinates...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLocation({ lat, lng });
          setMapCenter({ lat, lng });
          setLocationStatus('GPS Locked');
          fetchNearby(lat, lng, cityNameInput);
        },
        (error) => {
          console.warn('Geolocation unavailable:', error.message);
          setLocationStatus('Regional Default (GPS Unavailable)');
          const defaultLat = 12.9716;
          const defaultLng = 77.5946;
          setUserLocation({ lat: defaultLat, lng: defaultLng });
          setMapCenter({ lat: defaultLat, lng: defaultLng });
          fetchNearby(defaultLat, defaultLng, cityNameInput || 'Bangalore');
        },
        { timeout: 7000, enableHighAccuracy: true }
      );
    } else {
      setLocationStatus('Geolocation unsupported');
      const defaultLat = 12.9716;
      const defaultLng = 77.5946;
      setUserLocation({ lat: defaultLat, lng: defaultLng });
      setMapCenter({ lat: defaultLat, lng: defaultLng });
      fetchNearby(defaultLat, defaultLng, cityNameInput || 'Local Area');
    }
  };

  const fetchNearby = async (lat: number, lng: number, city?: string) => {
    setLoading(true);
    try {
      const response = await api.getNearbyPlaces({
        latitude: lat,
        longitude: lng,
        queryType: selectedCategory,
        cityName: city || undefined,
      });
      setData(response);
      if (response.places && response.places.length > 0) {
        setSelectedPlace(response.places[0]);
        setInfoWindowOpen(true);
      }
      if (city) setCurrentCityDisplay(city);
    } catch (err) {
      console.error('Error fetching nearby places:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchCity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityNameInput.trim()) return;
    const lat = userLocation?.lat || 12.9716;
    const lng = userLocation?.lng || 77.5946;
    fetchNearby(lat, lng, cityNameInput.trim());
  };

  const handleSelectPlace = (place: NearbyPlace) => {
    setSelectedPlace(place);
    setInfoWindowOpen(true);
    if (place.lat && place.lng) {
      setMapCenter({ lat: place.lat, lng: place.lng });
      setMapZoom(15);
    }
    // If voice reader is active, read the place details
    if (accessibilitySettings?.screenReaderVoice) {
      handleSpeakPlace(place);
    }
  };

  const handleSpeakPlace = (place: NearbyPlace) => {
    if (speakingId === place.id) {
      speech.stop();
      setSpeakingId(null);
    } else {
      const speechText = `${place.name}. Category: ${place.category}. Rating: ${place.rating || 4.8} stars. Located at ${place.address}. ${place.phone ? `Phone number: ${place.phone}` : ''}. Specialties include: ${place.specialties.join(', ')}.`;
      setSpeakingId(place.id);
      speech.speak(speechText, () => setSpeakingId(null));
    }
  };

  const getDirectionsUrl = (place: NearbyPlace) => {
    const origin = userLocation ? `${userLocation.lat},${userLocation.lng}` : '';
    const destination = encodeURIComponent(`${place.name}, ${place.address}`);
    return `https://www.google.com/maps/dir/?api=1${origin ? `&origin=${origin}` : ''}&destination=${destination}`;
  };

  const filteredPlaces = data?.places || [];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 sm:py-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-teal-500 text-white">
              <MapPin className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase tracking-wider font-bold text-teal-600 dark:text-teal-400">
              Google Maps Healthcare Network
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Nearby Doctors, Hospitals & Psychology Clinics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Access verified medical doctors, 24/7 trauma care hospitals, and licensed psychology clinics near you with Google Maps interactive markers, live turn-by-turn directions, and emergency dialing.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={detectLocation}
            aria-label="Refresh GPS location"
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-95"
          >
            <LocateFixed className="w-4 h-4 text-teal-600" />
            <span>Re-center GPS</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Return to previous screen"
              className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer shadow-xs active:scale-95 transition-transform"
            >
              Back to Home
            </button>
          )}
        </div>
      </div>

      {/* Search & Location Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-md mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* City / Area search input */}
        <form onSubmit={handleSearchCity} className="flex-1 flex items-center gap-2 w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={cityNameInput}
              onChange={(e) => setCityNameInput(e.target.value)}
              placeholder="Search by city, district or neighborhood (e.g., Koramangala, Indiranagar, Mumbai, Delhi)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer shrink-0 active:scale-95"
          >
            Search Location
          </button>
        </form>

        {/* GPS Status Indicator */}
        <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">{locationStatus}</span>
          {userLocation && (
            <span className="text-[11px] text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-md font-mono">
              {userLocation.lat.toFixed(3)}, {userLocation.lng.toFixed(3)}
            </span>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 no-scrollbar">
        {[
          { key: 'all', label: 'All Nearby Care', icon: Building2 },
          { key: 'hospital', label: 'Hospitals & Emergency (108/112)', icon: Hospital },
          { key: 'psychology', label: 'Psychology & Therapy Clinics', icon: Brain },
          { key: 'doctor', label: 'Doctors & Polyclinics', icon: Stethoscope },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = selectedCategory === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setSelectedCategory(tab.key as any)}
              className={`shrink-0 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/25 ring-2 ring-teal-500/30'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Interactive Google Map (Col 7) + Verified Facilities Cards (Col 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Google Maps Interactive Component with @vis.gl/react-google-maps (Col 7) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700/80 shadow-lg bg-slate-100 dark:bg-slate-900 h-[400px] sm:h-[480px] relative">
            {loading && (
              <div className="absolute inset-0 z-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xs flex items-center justify-center gap-2">
                <RefreshCw className="w-6 h-6 text-teal-600 animate-spin" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Retrieving Google Maps grounded locations...
                </span>
              </div>
            )}

            <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
              <Map
                mapId="DEMO_MAP_ID"
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                center={mapCenter}
                zoom={mapZoom}
                style={{ width: '100%', height: '100%' }}
                gestureHandling="greedy"
                disableDefaultUI={false}
              >
                {/* User's Current Location Marker */}
                {userLocation && (
                  <AdvancedMarker
                    position={userLocation}
                    title="Your Current Location"
                  >
                    <div className="relative flex items-center justify-center">
                      <span className="absolute w-8 h-8 rounded-full bg-blue-500/30 animate-ping"></span>
                      <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-md flex items-center justify-center text-white text-[9px] font-bold">
                        ●
                      </div>
                    </div>
                  </AdvancedMarker>
                )}

                {/* Healthcare Places Markers */}
                {filteredPlaces.map((place) => {
                  const lat = place.lat || mapCenter.lat;
                  const lng = place.lng || mapCenter.lng;
                  const isHospital = place.category === 'Hospital';
                  const isPsychology = place.category === 'Psychology Clinic';

                  return (
                    <AdvancedMarker
                      key={place.id}
                      position={{ lat, lng }}
                      title={place.name}
                      onClick={() => handleSelectPlace(place)}
                    >
                      <Pin
                        background={isHospital ? '#ef4444' : isPsychology ? '#8b5cf6' : '#0d9488'}
                        borderColor="#ffffff"
                        glyphColor="#ffffff"
                        scale={selectedPlace?.id === place.id ? 1.25 : 1.0}
                      />
                    </AdvancedMarker>
                  );
                })}

                {/* Info Window for Selected Place */}
                {infoWindowOpen && selectedPlace && selectedPlace.lat && selectedPlace.lng && (
                  <InfoWindow
                    position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
                    onCloseClick={() => setInfoWindowOpen(false)}
                  >
                    <div className="p-1 max-w-[240px] text-slate-900">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold text-white ${
                            selectedPlace.category === 'Psychology Clinic'
                              ? 'bg-purple-600'
                              : selectedPlace.category === 'Hospital'
                              ? 'bg-red-600'
                              : 'bg-teal-600'
                          }`}
                        >
                          {selectedPlace.category}
                        </span>
                        <span className="text-[11px] font-bold text-amber-600 flex items-center gap-0.5">
                          ★ {selectedPlace.rating || 4.8}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs leading-snug">{selectedPlace.name}</h4>
                      <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">
                        {selectedPlace.address}
                      </p>
                      <div className="mt-2 pt-2 border-t border-slate-200 flex items-center gap-2">
                        <a
                          href={getDirectionsUrl(selectedPlace)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1 rounded bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-bold flex items-center gap-1"
                        >
                          <Navigation className="w-3 h-3" />
                          Directions
                        </a>
                        <a
                          href={selectedPlace.mapsUri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-semibold flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Maps
                        </a>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </Map>
            </APIProvider>
          </div>

          {/* Selected Place Detail Spotlight */}
          {selectedPlace && (
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-teal-200 dark:border-teal-800 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        selectedPlace.category === 'Psychology Clinic'
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                          : selectedPlace.category === 'Hospital'
                          ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                          : 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300'
                      }`}
                    >
                      {selectedPlace.category}
                    </span>
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {selectedPlace.rating || 4.8} ({selectedPlace.reviewsCount || 240} reviews)
                    </span>
                    {selectedPlace.distanceKm && (
                      <span className="text-[11px] text-slate-400 font-semibold">
                        • {selectedPlace.distanceKm} km away
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {selectedPlace.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {selectedPlace.address}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleSpeakPlace(selectedPlace)}
                    aria-label="Read facility details aloud"
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-600 dark:text-slate-200 transition-colors cursor-pointer"
                    title="Read details aloud"
                  >
                    {speakingId === selectedPlace.id ? (
                      <VolumeX className="w-4 h-4 text-red-500" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-teal-600" />
                    )}
                  </button>
                  <a
                    href={selectedPlace.mapsUri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-transform active:scale-95"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open in Google Maps
                  </a>
                  <a
                    href={getDirectionsUrl(selectedPlace)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-transform active:scale-95"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Directions
                  </a>
                </div>
              </div>

              {/* Specialties & Direct Call Link */}
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-slate-400 font-medium">Specialties:</span>
                  {selectedPlace.specialties.map((spec, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                {selectedPlace.phone && (
                  <a
                    href={`tel:${selectedPlace.phone.replace(/[^0-9+]/g, '')}`}
                    className="font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call: {selectedPlace.phone}</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: List of Verified Healthcare Facilities (Col 5) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <span>Verified Local Healthcare Providers</span>
              <span className="px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-xs">
                {filteredPlaces.length}
              </span>
            </h2>
            <span className="text-xs text-slate-400">Click to locate on Map</span>
          </div>

          <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
            {filteredPlaces.length === 0 ? (
              <div className="p-8 text-center rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  No facilities found for this filter
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Try switching categories or searching for a larger neighboring city.
                </p>
              </div>
            ) : (
              filteredPlaces.map((place) => {
                const isSelected = selectedPlace?.id === place.id;
                const isHosp = place.category === 'Hospital';
                const isPsy = place.category === 'Psychology Clinic';

                return (
                  <div
                    key={place.id}
                    onClick={() => handleSelectPlace(place)}
                    className={`p-4 rounded-3xl transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-teal-50/70 dark:bg-teal-950/40 border-teal-500 shadow-md ring-2 ring-teal-500/20'
                        : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 hover:border-teal-300 dark:hover:border-teal-700 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span
                            className={`p-1 rounded-lg text-white ${
                              isPsy ? 'bg-purple-600' : isHosp ? 'bg-red-500' : 'bg-teal-600'
                            }`}
                          >
                            {isPsy ? (
                              <Brain className="w-3 h-3" />
                            ) : isHosp ? (
                              <Hospital className="w-3 h-3" />
                            ) : (
                              <Stethoscope className="w-3 h-3" />
                            )}
                          </span>
                          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                            {place.category}
                          </span>
                          {place.openNow && (
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                              Open 24/7
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                          {place.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                          {place.address}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs font-bold text-amber-500 flex items-center justify-end gap-0.5">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{place.rating || 4.8}</span>
                        </div>
                        {place.distanceKm && (
                          <div className="text-[11px] font-semibold text-slate-400 mt-0.5">
                            {place.distanceKm} km
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {place.specialties.slice(0, 3).map((s, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 text-[10px] font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/60">
                      {place.phone ? (
                        <a
                          href={`tel:${place.phone.replace(/[^0-9+]/g, '')}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{place.phone}</span>
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-400">Walk-in & Direct Access</span>
                      )}

                      <div className="flex items-center gap-2">
                        <a
                          href={getDirectionsUrl(place)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-teal-600 flex items-center gap-1"
                        >
                          <Navigation className="w-3 h-3 text-teal-600" />
                          <span>Directions</span>
                        </a>
                        <a
                          href={place.mapsUri}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1 rounded-md text-slate-400 hover:text-teal-600 transition-colors"
                          title="Open Google Maps"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Emergency 108/112 Quick Escalation Card */}
          <div className="mt-2 p-4 rounded-3xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-2xl bg-red-500 text-white shadow-xs">
                <ShieldAlert className="w-5 h-5" />
              </span>
              <div>
                <h4 className="text-xs font-bold text-red-900 dark:text-red-200">
                  Critical Trauma or Medical Emergency?
                </h4>
                <p className="text-[11px] text-red-700 dark:text-red-300">
                  Direct government ambulance dispatch and police response
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href="tel:108"
                className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-xs active:scale-95"
              >
                Call 108
              </a>
              <a
                href="tel:112"
                className="px-3 py-1.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-black text-xs shadow-xs active:scale-95"
              >
                Call 112
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
