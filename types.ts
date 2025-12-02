export type Gender = 'male' | 'female' | 'other';
export type Language = 'ru' | 'kk';

export interface UserProfile {
  phone: string;
  age: number;
  gender: Gender;
  region: string;
  language: Language;
}

export type FlagType = 'RED' | 'GREEN';

export interface Question {
  id: number;
  text: string;
  context: string;
  animationType: 'phone' | 'restaurant' | 'gift' | 'listening' | 'money' | 'family' | 'control' | 'ex' | 'growth' | 'time';
}

export interface Answer {
  questionId: number;
  questionText: string;
  choice: FlagType;
}

export enum AppState {
  ONBOARDING = 'ONBOARDING',
  QUIZ = 'QUIZ',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS'
}