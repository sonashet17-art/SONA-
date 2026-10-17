export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'Student' | 'Working Professional' | 'Caregiver' | 'Senior' | 'General';
  isGuest: boolean;
  avatarSeed?: string;
  medicalNotes?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  createdAt: string;
}

export interface SymptomAnalysis {
  detectedSymptoms: string[];
  predictedConditions?: {
    name: string;
    confidence: number;
    seasonalNote?: string;
  }[];
  riskScore: number; // 0 to 100
  riskLevel: 'Low' | 'Moderate' | 'Severe';
  isSevere: boolean;
  suggestedCareSteps: string[];
  emergencyTriggered: boolean;
  recommendedDoctorType?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  analysis?: SymptomAnalysis;
  emotionalTone?: string;
  affirmation?: string;
  copingTip?: string;
  suggestedExercise?: string;
}

export interface JournalEntry {
  id: string;
  date: string; // ISO string
  title: string;
  content: string;
  mood: 'Joyful' | 'Calm' | 'Anxious' | 'Stressed' | 'Exhausted' | 'Sad' | 'Frustrated';
  tags: string[];
  stressAnalysis?: {
    stressScore: number;
    stressLevel: 'Low' | 'Moderate' | 'High';
    stressPatterns: string[];
    triggersDetected?: string[];
    positiveCopingMechanisms: string[];
    empatheticReflection: string;
    upliftingQuote: string;
  };
}

export interface MoodLog {
  id: string;
  date: string; // YYYY-MM-DD
  score: number; // 1-10
  mood: string;
  stressScore: number; // 0-100
  note?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  experience: string;
  rating: number;
  reviewsCount: number;
  availableTime: string;
  consultationType: 'Video Call' | 'In-Clinic' | 'Instant Call';
  fee: string;
  phone: string;
  avatar: string;
  languages: string[];
}

export interface Psychologist {
  id: string;
  name: string;
  title: string;
  qualifications: string;
  experience: string;
  focusAreas: string[];
  rating: number;
  reviewsCount: number;
  availableSlot: string;
  sessionFee: string;
  phone: string;
  avatar: string;
  approach: string;
}

export interface Helpline {
  name: string;
  number: string;
  service: string;
  hours: string;
  tag: string;
  isEmergency?: boolean;
}

export interface NearbyPlace {
  id: string;
  name: string;
  category: 'Hospital' | 'Doctor / Clinic' | 'Psychology Clinic' | 'Emergency Care';
  address: string;
  mapsUri: string;
  rating?: number;
  reviewsCount?: number;
  distanceKm?: number;
  phone?: string;
  openNow?: boolean;
  specialties: string[];
  lat?: number;
  lng?: number;
}

export interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'extra-large'; // normal 100%, large 115%, extra-large 130%
  highContrast: boolean;
  simplifiedLanguage: boolean;
  screenReaderVoice: boolean;
}

export interface NearbyPlacesResponse {
  summary: string;
  groundingChunks: Array<{
    maps?: {
      uri?: string;
      title?: string;
      placeAnswerSources?: {
        reviewSnippets?: string[];
      };
    };
  }>;
  places: NearbyPlace[];
  location: {
    latitude: number;
    longitude: number;
    cityName?: string;
  };
}

export interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'xlarge';
  highContrast: boolean;
  autoSpeak: boolean;
  simplifiedMode: boolean;
  ageGroup: 'child' | 'student' | 'adult' | 'senior';
}


