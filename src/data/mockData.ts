import { Doctor, Psychologist, Helpline } from '../types';

export const EMERGENCY_NUMBERS = {
  nationalEmergency: '112',
  ambulance: '108',
  police: '100',
  womenHelpline: '1091',
  teleManas: '14416',
  vandrevala: '+919999666555',
  kiran: '1800-599-0019',
};

export const HELPLINES: Helpline[] = [
  {
    name: 'National Emergency Response System',
    number: '112',
    service: 'All-in-one Emergency (Police, Fire, Medical Ambulance)',
    hours: '24/7 Toll-Free',
    tag: 'Critical Emergency',
    isEmergency: true,
  },
  {
    name: 'National Ambulance & Medical Dispatch',
    number: '108',
    service: 'Emergency Medical Technician & Hospital Transport',
    hours: '24/7 Free Immediate Dispatch',
    tag: 'Medical Emergency',
    isEmergency: true,
  },
  {
    name: 'Tele-MANAS (Mental Health Helpline)',
    number: '14416',
    service: 'Govt. Comprehensive 24/7 Mental Health Psychological Care',
    hours: '24/7 Multilingual',
    tag: 'Mental Health Support',
  },
  {
    name: 'Vandrevala Foundation Helpline',
    number: '9999 666 555',
    service: 'Free mental health counseling, distress support & crisis intervention',
    hours: '24/7 Available',
    tag: 'Psychological Crisis',
  },
  {
    name: 'KIRAN Mental Health Helpline',
    number: '1800-599-0019',
    service: 'Early screening, psychological first aid & distress alleviation',
    hours: '24/7 Toll-Free',
    tag: 'Emotional Wellness',
  },
];

export const VERIFIED_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Ananya Sharma, MD',
    specialty: 'Senior General Physician & Internal Medicine',
    hospital: 'Apex Memorial Care & TeleClinic',
    experience: '14+ Years Experience',
    rating: 4.9,
    reviewsCount: 320,
    availableTime: 'Available in 5 mins',
    consultationType: 'Video Call',
    fee: '₹450 / $15',
    phone: '+91 98110 23456',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
    languages: ['English', 'Hindi', 'Bengali'],
  },
  {
    id: 'doc-2',
    name: 'Dr. Rajeshwar Mehta, MBBS, DNB',
    specialty: 'Pulmonologist & Respiratory Specialist',
    hospital: 'Metro Chest & Critical Health Institute',
    experience: '18+ Years Experience',
    rating: 4.8,
    reviewsCount: 280,
    availableTime: 'Available today 4:00 PM',
    consultationType: 'Video Call',
    fee: '₹600 / $20',
    phone: '+91 98220 87654',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
    languages: ['English', 'Hindi', 'Gujarati'],
  },
  {
    id: 'doc-3',
    name: 'Dr. Priya V. Nair, MD (Med), DM',
    specialty: 'Gastroenterologist & Abdominal Care',
    hospital: 'Narayana Digestive Health Sciences',
    experience: '12+ Years Experience',
    rating: 4.9,
    reviewsCount: 195,
    availableTime: 'Available today 6:30 PM',
    consultationType: 'Video Call',
    fee: '₹550 / $18',
    phone: '+91 98330 11223',
    avatar: 'https://images.unsplash.com/photo-1594824813576-0f81d182283e?auto=format&fit=crop&q=80&w=300',
    languages: ['English', 'Malayalam', 'Tamil', 'Hindi'],
  },
  {
    id: 'doc-4',
    name: 'Dr. Arjun K. Sen, MD, DM (Neuro)',
    specialty: 'Consultant Neurologist (Headache & Migraine Focus)',
    hospital: 'Fortis Neuro & Spine Center',
    experience: '16+ Years Experience',
    rating: 4.9,
    reviewsCount: 410,
    availableTime: 'Available in 15 mins',
    consultationType: 'Instant Call',
    fee: '₹750 / $25',
    phone: '+91 98440 99887',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300',
    languages: ['English', 'Hindi', 'Bengali'],
  },
];

export const VERIFIED_PSYCHOLOGISTS: Psychologist[] = [
  {
    id: 'psy-1',
    name: 'Dr. Meera Vasudevan, Ph.D.',
    title: 'Licensed Clinical Psychologist & Cognitive Behavioral Therapist',
    qualifications: 'Ph.D. in Clinical Psychology, NIMHANS Fellow',
    experience: '11 Years Experience',
    focusAreas: ['Student Exam Anxiety', 'Burnout & Fatigue', 'Overthinking', 'Panic Disorders'],
    rating: 4.9,
    reviewsCount: 245,
    availableSlot: 'Available today at 5:00 PM',
    sessionFee: '₹800 / $25 per 45 min',
    phone: '+91 97110 54321',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    approach: 'Warm, trauma-informed CBT and compassionate acceptance to unravel self-criticism.',
  },
  {
    id: 'psy-2',
    name: 'Rahul Sen, M.Phil, RCI Reg.',
    title: 'Adolescent & Young Adult Counseling Psychologist',
    qualifications: 'M.Phil Clinical Psychology, RCI Certified',
    experience: '8 Years Experience',
    focusAreas: ['Academic Stress', 'Parental Pressure', 'Relationship Boundaries', 'Self-Esteem'],
    rating: 4.8,
    reviewsCount: 180,
    availableSlot: 'Available in 30 mins',
    sessionFee: '₹650 / $20 per 45 min',
    phone: '+91 97220 65432',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    approach: 'Practical mindfulness, actionable micro-goals, and grounding strategies for daily tension.',
  },
  {
    id: 'psy-3',
    name: 'Dr. Sonia Mathur, Psy.D.',
    title: 'Senior Psychotherapist & Workplace Wellness Specialist',
    qualifications: 'Doctorate in Psychology, Mindfulness Trainer',
    experience: '15 Years Experience',
    focusAreas: ['Corporate Stress & Imposter Syndrome', 'Depressive Slumps', 'Grief & Transitions'],
    rating: 5.0,
    reviewsCount: 310,
    availableSlot: 'Available Tomorrow 10:00 AM',
    sessionFee: '₹950 / $30 per 50 min',
    phone: '+91 97330 76543',
    avatar: 'https://images.unsplash.com/photo-1580894732488-82550186173a?auto=format&fit=crop&q=80&w=300',
    approach: 'Holistic mind-body regulation, emotional resilience coaching, and gentle somatic processing.',
  },
];

export const AFFIRMATIONS: string[] = [
  "You are doing the best you can with the energy you have right now, and that is enough.",
  "Your worth is not defined by your productivity, grades, or unchecked to-do lists.",
  "Inhale peace, exhale tension. This difficult feeling will pass like clouds in the sky.",
  "You don't need to have everything figured out today; just focus on the next kind step.",
  "Taking a rest is not giving up; it is recharging so your mind and heart can heal.",
  "You are safe in this present moment. Breathe deep and release the weight you carry.",
  "Progress isn't always loud; sometimes it's simply deciding to try again gently."
];

export const INITIAL_JOURNAL_SAMPLE = {
  id: 'sample-1',
  date: new Date(Date.now() - 86400000).toISOString(),
  title: 'Midterm Pressure & Late Night Overthinking',
  content: 'Felt overwhelmed today balancing assignments and preparing for tomorrow. My chest felt slightly tight and I kept doubting whether I had studied enough. Drank too much coffee and had trouble sleeping.',
  mood: 'Anxious' as const,
  tags: ['Exams', 'Sleep', 'Academic Stress'],
  stressAnalysis: {
    stressScore: 68,
    stressLevel: 'High' as const,
    stressPatterns: [
      'Academic perfectionism and fear of falling behind',
      'Caffeine overconsumption interfering with restorative sleep',
      'Anticipatory performance anxiety'
    ],
    triggersDetected: ['Exam deadline', 'Self-doubt', 'Sleep deficit'],
    positiveCopingMechanisms: [
      'Box breathing for 4 minutes before opening books',
      'Cut caffeine after 3:00 PM and replace with warm herbal chamomile or water',
      'Write down what you DO know to ground realistic competence'
    ],
    empatheticReflection: 'It is so natural to feel anxious when something matters to you. Remember your intelligence is not a snapshot of one test.',
    upliftingQuote: 'You do not have to see the whole staircase, just take the first step. — Martin Luther King Jr.'
  }
};
