export interface UserProfile {
  name: string;
  age: string;
  gender: string;
  goals: string[];
  stressLevel: string;
  sleepQuality: string;
  activityLevel: string;
  onboardingCompleted: boolean;
}

export type RoutineCategory = 'breathing' | 'stretching' | 'walking' | 'mindfulness' | 'quick-reset';

export interface Routine {
  id: string;
  title: string;
  description: string;
  category: RoutineCategory;
  durationMin: number;
  difficulty: 'Beginner' | 'Gentle' | 'Light';
  energyGain: 'Gentle' | 'Refreshing' | 'Calming' | 'Restorative';
  instructions: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface MoodEntry {
  day: string; // e.g. "Mon", "Tue"
  mood: 'calm' | 'tired' | 'stressed' | 'focused' | 'happy';
  score: number; // 1-5 offset for graphing
}

export interface DailyLog {
  waterMl: number;
  steps: number;
  meditationMin: number;
  sleepHours: number;
  completedRoutineIds: string[];
}

export const INITIAL_PROFILE: UserProfile = {
  name: "Amit",
  age: "32",
  gender: "Male",
  goals: ["Manage stress", "Better sleep", "Melt belly fat"],
  stressLevel: "High",
  sleepQuality: "Poor",
  activityLevel: "Sedentary",
  onboardingCompleted: false, // Starts as false to trigger the beautiful onboarding flow
};

export const DEFAULT_ROUTINES: Routine[] = [
  {
    id: "breathing-478",
    title: "4-7-8 Stress Reset Breathing",
    description: "An instant nervous system tranquilizer to halt anxiety and work stress.",
    category: "breathing",
    durationMin: 3,
    difficulty: "Beginner",
    energyGain: "Calming",
    instructions: [
      "Inhale quietly through your nose for 4 seconds.",
      "Hold your breath gently for a count of 7 seconds.",
      "Exhale completely through your mouth with a soft whoosh for 8 seconds.",
      "Repeat the cycle 4 times to feel an immediate shift in heart rate."
    ]
  },
  {
    id: "desk-stretch",
    title: "5-Min Back & Neck Desk Stretch",
    description: "Relieve mid-day tightness from long sitting hours at your home or office desk.",
    category: "stretching",
    durationMin: 5,
    difficulty: "Gentle",
    energyGain: "Refreshing",
    instructions: [
      "Sit tall. Gently tilt your ear towards your shoulder and hold for 15 seconds. Swap sides.",
      "Interlock your fingers, press your palms outwards, and stretch your arms high above your head.",
      "Twist your torso gently to the right using your chair handle, then twist slowly to the left.",
      "Roll your shoulders backwards in slow circles 10 times to release residual posture fatigue."
    ]
  },
  {
    id: "brisk-post-meal",
    title: "10-Min Relaxed Post-Meal Walk",
    description: "A slow, calming stride to aid digestion, regulate glucose surges, and melt belly fat naturally.",
    category: "walking",
    durationMin: 10,
    difficulty: "Light",
    energyGain: "Gentle",
    instructions: [
      "Step out or walk softly in your room within 15 minutes of finishing lunch or dinner.",
      "Maintain a pleasant, relaxed pace — no need to rush or race.",
      "Breathe naturally through your nose and let your arms swing comfortably at your sides.",
      "Aim for gentle, steady movement rather than vigorous cardio stress."
    ]
  },
  {
    id: "belly-breathing",
    title: "Pre-Sleep Deep Balloon Breathing",
    description: "Calm your mind and release stress from a long day for quiet, restorative sleep.",
    category: "breathing",
    durationMin: 4,
    difficulty: "Beginner",
    energyGain: "Restorative",
    instructions: [
      "Lie flat on your back or sit in a highly comfortable reclining position.",
      "Place one hand softly on your belly and the other hand gently on your chest.",
      "Inhale deeply to expand your belly like a soft balloon; your chest should remain quiet.",
      "Exhale slowly, feeling your belly fall gentle as your body gets heavier and more relaxed."
    ]
  },
  {
    id: "mindful-chai",
    title: "5-Min Mindful Tea/Chai Sip",
    description: "Turn your daily tea break into a sensory stress reset and mindful escape.",
    category: "mindfulness",
    durationMin: 5,
    difficulty: "Beginner",
    energyGain: "Calming",
    instructions: [
      "Hold your warm cup in both hands. Feel the gentle warmth radiate into your fingers.",
      "Look at the subtle steam rising, observing its soft shapes.",
      "Close your eyes and breathe in the rich aroma of cardamom, ginger, or tea leaves.",
      "Take a slow, micro-sip. Appreciate the taste fully before swallowing gracefully."
    ]
  }
];
