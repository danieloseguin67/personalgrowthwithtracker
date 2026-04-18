export interface GrowthEntry {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  energy: number; // 1-10
  confidence: number; // 1-10
  gratitude: string[];
  boundariesSet: string[];
  learningMoments: string[];
  notes: string;
  mood: 'great' | 'good' | 'okay' | 'low' | 'rest-day';
  createdAt: string; // ISO timestamp
}

export interface WeeklySummary {
  weekStart: string; // ISO date string
  weekEnd: string;
  entries: GrowthEntry[];
  averageEnergy: number;
  averageConfidence: number;
  totalGratitude: number;
  totalBoundaries: number;
  totalLearningMoments: number;
  encouragingMessage: string;
}

export interface AppSettings {
  remindersEnabled: boolean;
  reminderTime: string; // HH:MM
  reminderDays: number[]; // 0=Sun, 6=Sat
  googleClientId: string;
  theme: 'sage' | 'lavender' | 'ocean';
  notificationsPermission: 'granted' | 'denied' | 'default';
}
