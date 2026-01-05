export type Difficulty = 'EASY' | 'NORMAL' | 'HARD';
export type TrainingType = 'NORMAL' | 'HARD';

export interface Exercise {
  name: string;
  reps: number;
}

export interface Block {
  name: string;
  type: 'warmup' | 'run' | 'strength' | 'cooldown';
  duration?: string;
  distance?: string;
  rounds?: number;
  exercises?: Exercise[];
}

export interface UserProgress {
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  lastWorkoutDate: string | null;
  easyCount: number;
  repIncrement: {
    upper: number;
    lower: number;
  };
}
