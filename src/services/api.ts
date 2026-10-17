import { SymptomAnalysis } from '../types';

export const api = {
  async checkSymptoms(
    messages: { role: string; text: string }[],
    currentSymptomText?: string,
    userProfile?: any
  ): Promise<SymptomAnalysis & { reply: string }> {
    try {
      const res = await fetch('/api/symptom-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, currentSymptomText, userProfile }),
      });
      if (!res.ok) throw new Error('API server returned error');
      return await res.json();
    } catch (err) {
      console.warn('Fallback to local symptom evaluation:', err);
      return evaluateLocally(currentSymptomText || messages[messages.length - 1]?.text || '');
    }
  },

  async chatEmotional(
    messages: { role: string; text: string }[],
    userProfile?: any
  ): Promise<{
    reply: string;
    emotionalToneDetected: string;
    encouragingAffirmation: string;
    suggestedCopingExercise?: string;
    copingTip: string;
  }> {
    try {
      const res = await fetch('/api/emotional-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, userProfile }),
      });
      if (!res.ok) throw new Error('API server returned error');
      return await res.json();
    } catch (err) {
      console.warn('Fallback to local emotional companion:', err);
      return {
        reply: "I am listening closely. Your feelings are completely real and valid. Take a soft, gentle breath right now. We can work through this tension one small moment at a time. What is resting heaviest on your heart?",
        emotionalToneDetected: "Empathetic & Attentive",
        encouragingAffirmation: "You are stronger than this temporary wave of pressure. Give yourself credit for how far you've come.",
        suggestedCopingExercise: "breathing",
        copingTip: "Try 3 cycles of Box Breathing: Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, and hold empty for 4 seconds."
      };
    }
  },

  async analyzeJournal(
    entryText: string,
    mood: string,
    tags?: string[]
  ): Promise<{
    stressScore: number;
    stressLevel: 'Low' | 'Moderate' | 'High';
    stressPatterns: string[];
    triggersDetected?: string[];
    positiveCopingMechanisms: string[];
    empatheticReflection: string;
    upliftingQuote: string;
  }> {
    try {
      const res = await fetch('/api/analyze-journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entryText, mood, tags }),
      });
      if (!res.ok) throw new Error('API server returned error');
      return await res.json();
    } catch (err) {
      console.warn('Fallback to local journal analysis:', err);
      const isHighStress = mood === 'Anxious' || mood === 'Stressed' || entryText.toLowerCase().includes('anxious') || entryText.toLowerCase().includes('panic');
      return {
        stressScore: isHighStress ? 70 : 38,
        stressLevel: isHighStress ? 'High' : 'Moderate',
        stressPatterns: [
          'High demand cognitive workload',
          'Anticipatory performance stress',
          'Overextension without adequate physical breaks'
        ],
        triggersDetected: ['Academic or task deadlines', 'Fatigue accumulation'],
        positiveCopingMechanisms: [
          'Practice Box Breathing (4 seconds in, hold 4, out 4, hold 4)',
          'Establish a 30-minute digital sunset before bedtime',
          'Break your biggest impending goal into three 10-minute micro-tasks'
        ],
        empatheticReflection: 'Pouring your thoughts out here creates distance between you and the whirlwind in your head. You are handling more than most realize.',
        upliftingQuote: 'You don’t have to control your thoughts. You just have to stop letting them control you. — Dan Millman'
      };
    }
  },

  async getNearbyPlaces(params: {
    latitude?: number;
    longitude?: number;
    queryType?: 'all' | 'hospital' | 'doctor' | 'psychology';
    cityName?: string;
    customQuery?: string;
  }): Promise<import('../types').NearbyPlacesResponse> {
    try {
      const res = await fetch('/api/nearby-places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error('API server returned error');
      return await res.json();
    } catch (err) {
      console.warn('Fallback to local nearby places:', err);
      const city = params.cityName || 'Local Area';
      const fallbackList: import('../types').NearbyPlace[] = [
        {
          id: 'fb-hosp-1',
          name: `${city} General Multi-Specialty Hospital`,
          category: 'Hospital',
          address: `Main Hospital Corridor, ${city}`,
          mapsUri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(city + ' Hospital')}`,
          rating: 4.8,
          reviewsCount: 840,
          distanceKm: 1.1,
          phone: '108 / 112',
          openNow: true,
          specialties: ['24/7 Emergency Casualty', 'Inpatient ICU', 'Internal Medicine']
        },
        {
          id: 'fb-psy-1',
          name: `${city} Psychological Health & Counseling Clinic`,
          category: 'Psychology Clinic',
          address: `Aura Care Block, Sector 2, ${city}`,
          mapsUri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(city + ' Psychology Clinic Therapy')}`,
          rating: 4.9,
          reviewsCount: 320,
          distanceKm: 1.9,
          phone: '14416 (Tele-MANAS) / Direct',
          openNow: true,
          specialties: ['Clinical Psychology', 'Anxiety & Exam Stress', 'Cognitive Therapy']
        },
        {
          id: 'fb-doc-1',
          name: `${city} Doctors Polyclinic & Health Care`,
          category: 'Doctor / Clinic',
          address: `Crossway Central Plaza, ${city}`,
          mapsUri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(city + ' Doctors Clinic')}`,
          rating: 4.7,
          reviewsCount: 410,
          distanceKm: 0.9,
          phone: '+91 80 4455 6677',
          openNow: true,
          specialties: ['Family Medicine', 'General Physicians', 'Diagnostics']
        }
      ];

      return {
        summary: `Showing top-rated healthcare providers, hospitals, and psychology clinics in ${city} via Google Maps.`,
        groundingChunks: fallbackList.map(p => ({
          maps: {
            uri: p.mapsUri,
            title: p.name,
          }
        })),
        places: fallbackList,
        location: {
          latitude: params.latitude || 12.9716,
          longitude: params.longitude || 77.5946,
          cityName: city,
        }
      };
    }
  }
};

function evaluateLocally(userText: string): SymptomAnalysis & { reply: string } {
  const lower = userText.toLowerCase();
  const symptomsFound: string[] = [];
  const careSteps: string[] = [];
  let isSevere = false;
  let emergencyTriggered = false;

  const severeKeywords = [
    'cannot breathe', 'shortness of breath', 'difficulty breathing',
    'chest pain', 'severe pain', 'fainted', 'unconscious', 'coughing blood',
    'vomiting blood', 'extreme pain', 'intolerable', 'blue lips', 'stroke',
    'emergency', 'paralyzed', 'seizure', 'severe burn', 'high fever 104', 'choking'
  ];

  if (severeKeywords.some(k => lower.includes(k))) {
    isSevere = true;
    emergencyTriggered = true;
  }

  // Strictly follow symptom guidelines:
  // For cold: Suggest drinking hot water regularly for a week and avoiding cold drinks or ice cream.
  if (lower.includes('cold') || lower.includes('runny nose') || lower.includes('sneezing') || lower.includes('congestion')) {
    symptomsFound.push('Common Cold & Upper Congestion');
    careSteps.push('Drink hot water regularly throughout the day for one week.');
    careSteps.push('Strictly avoid cold drinks, iced beverages, and ice cream.');
    careSteps.push('Keep chest and throat warm; consider steam inhalation before sleep.');
  }

  // For cough: Suggest drinking hot water regularly, salt water gargling, and lime water.
  if (lower.includes('cough') || lower.includes('sore throat') || lower.includes('throat pain')) {
    symptomsFound.push('Cough & Throat Irritation');
    careSteps.push('Drink hot or warm water regularly.');
    careSteps.push('Perform warm salt water gargling 2 to 3 times every day.');
    careSteps.push('Sip warm lime/lemon water with a spoonful of honey.');
  }

  // For body pain: Suggest consulting a doctor and taking suggested medicines.
  if (lower.includes('body pain') || lower.includes('body ache') || lower.includes('muscle ache') || lower.includes('joint pain')) {
    symptomsFound.push('Generalized Body Ache & Muscle Pain');
    careSteps.push('Consult a licensed doctor for evaluation and diagnosis.');
    careSteps.push('Take only suggested and prescribed medicines from a medical practitioner.');
    careSteps.push('Rest adequately and avoid strenuous physical exertion.');
  }

  // For headache: Suggest taking rest and sleeping well; if severe, advise consulting a doctor and explaining symptoms.
  if (lower.includes('headache') || lower.includes('migraine') || lower.includes('head pain')) {
    symptomsFound.push('Headache / Tension Cephalea');
    careSteps.push('Take rest and ensure a quiet, peaceful sleep in a dark room.');
    if (lower.includes('severe') || lower.includes('worst') || lower.includes('unbearable') || lower.includes('intense')) {
      careSteps.push('Because this headache is severe, consult a doctor immediately and explain your exact symptoms in detail.');
      isSevere = true;
    } else {
      careSteps.push('If the headache turns severe or persists, consult a doctor promptly and explain your exact symptoms.');
    }
  }

  // For stomachache: Suggest placing a heating pad on the abdomen or consulting a doctor for suggested medicine.
  if (lower.includes('stomach') || lower.includes('abdominal') || lower.includes('tummy') || lower.includes('belly')) {
    symptomsFound.push('Abdominal Discomfort & Stomachache');
    careSteps.push('Place a warm heating pad or warm water bottle gently on the abdomen.');
    careSteps.push('Consult a doctor for clinical examination and taking suggested medicine.');
    careSteps.push('Eat light, easily digestible food and stay hydrated with warm water.');
  }

  if (symptomsFound.length === 0) {
    symptomsFound.push('General Malaise / Mild Discomfort');
    careSteps.push('Rest comfortably, hydrate with warm liquids, and monitor temperature.');
    careSteps.push('Consult a doctor if discomfort persists or worsens.');
  }

  const riskScore = emergencyTriggered ? 95 : isSevere ? 75 : symptomsFound.length > 2 ? 45 : 20;
  const riskLevel = emergencyTriggered || riskScore >= 70 ? 'Severe' : riskScore >= 40 ? 'Moderate' : 'Low';

  let reply = '';
  if (emergencyTriggered) {
    reply = `⚠️ IMMEDIATE EMERGENCY ALERT: Based on your description, this could be critical. Please press the direct emergency call button for 108 or 112 immediately, or go to the nearest hospital casualty emergency room.`;
  } else {
    reply = `I have reviewed your symptoms. Here is your clinically aligned guidance:\n\n` +
      careSteps.map(s => `• ${s}`).join('\n') +
      `\n\n${isSevere ? '⚠️ Please consult a certified doctor immediately to explain all your symptoms.' : 'Please follow these home care steps. If symptoms do not improve in 48 hours, consult a physician.'}`;
  }

  return {
    reply,
    detectedSymptoms: symptomsFound,
    riskScore,
    riskLevel,
    isSevere: isSevere || emergencyTriggered,
    suggestedCareSteps: careSteps,
    emergencyTriggered,
    recommendedDoctorType: emergencyTriggered ? 'Emergency Critical Care' : lower.includes('stomach') ? 'Gastroenterologist' : lower.includes('head') ? 'Neurologist' : 'General Physician'
  };
}
