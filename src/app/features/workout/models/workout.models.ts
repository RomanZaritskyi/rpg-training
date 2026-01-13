export type Difficulty = 'EASY' | 'NORMAL' | 'HARD' | 'FAILED';
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
