export type Mood =
  | 'Happy'
  | 'Excited'
  | 'Calm'
  | 'Sad'
  | 'Anxious'
  | 'Proud'
  | 'Grateful'
  | 'Tired'
  | 'Angry'
  | 'Stressed'
  | 'Content';

export interface MoodOption {
  mood: Mood;
  emoji: string;
  value: number;
}

export interface MoodEntry {
  id: string;
  mood: Mood;
  emoji: string;
  date: string;
  journal?: string;
  value: number;
}
