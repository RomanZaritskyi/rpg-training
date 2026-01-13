import { computed, effect, Injectable, inject, signal } from '@angular/core';
import { DateService, StorageService } from '../../../core';

const STORAGE_KEY = 'rpg-fitness-progress';

export interface UserProgress {
  level: number;
  xp: number;
  xpToNextLevel: number;
  lastWorkoutDate: string | null;
  easyCount: number;
  repIncrement: { upper: number; lower: number };
}

const DEFAULT_PROGRESS: UserProgress = {
  level: 1,
  xp: 0,
  xpToNextLevel: 350,
  lastWorkoutDate: null,
  easyCount: 0,
  repIncrement: { upper: 0, lower: 0 },
};

@Injectable({
  providedIn: 'root',
})
export class UserProgressService {
  private readonly storage = inject(StorageService);

  readonly progress = signal<UserProgress>(
    this.storage.get<UserProgress>(STORAGE_KEY, DEFAULT_PROGRESS)
  );

  readonly level = computed(() => this.progress().level);
  readonly xp = computed(() => this.progress().xp);
  readonly xpToNextLevel = computed(() => this.progress().xpToNextLevel);
  readonly repIncrement = computed(() => this.progress().repIncrement);

  readonly xpPercentage = computed(() => (this.xp() / this.xpToNextLevel()) * 100);

  constructor() {
    effect(() => {
      this.storage.set(STORAGE_KEY, this.progress());
    });
  }

  awardXp(amount: number): { leveledUp: boolean; newLevel: number } {
    const current = this.progress();
    let newXp = current.xp + amount;
    let newLevel = current.level;
    let newXpToNextLevel = current.xpToNextLevel;
    let leveledUp = false;

    while (newXp >= newXpToNextLevel) {
      newXp -= newXpToNextLevel;
      newLevel += 1;
      newXpToNextLevel = Math.floor(newXpToNextLevel * 1.2);
      leveledUp = true;
    }

    this.progress.update((p) => ({
      ...p,
      xp: newXp,
      level: newLevel,
      xpToNextLevel: newXpToNextLevel,
    }));

    return { leveledUp, newLevel };
  }

  recordDifficulty(difficulty: 'EASY' | 'NORMAL' | 'HARD' | 'FAILED'): boolean {
    const current = this.progress();
    const newEasyCount = difficulty === 'EASY' ? current.easyCount + 1 : 0;

    this.progress.update((p) => ({
      ...p,
      easyCount: newEasyCount,
    }));

    return newEasyCount >= 2;
  }

  increaseReps(): void {
    this.progress.update((p) => ({
      ...p,
      repIncrement: {
        upper: p.repIncrement.upper + 2,
        lower: p.repIncrement.lower + 3,
      },
      easyCount: 0,
    }));
  }

  resetEasyCount(): void {
    this.progress.update((p) => ({
      ...p,
      easyCount: 0,
    }));
  }
}
