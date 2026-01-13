import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserProgressService } from '../../../progress/services/user-progress.service';
import { TrainingPlanService } from '../../services/training-plan.service';
import { WorkoutStateService } from '../../services/workout-state.service';
import { Card, Icon, Button, ProgressBar } from '../../../../shared';
import type { Difficulty } from '../../models/workout.models';

@Component({
  selector: 'app-workout-finish',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, Icon, Button, ProgressBar],
  template: `
    <ui-card>
      <ng-container card-header>
        <div class="bg-linear-to-r from-yellow-600 to-orange-600 p-6">
          <div class="flex items-center justify-center gap-3 mb-2">
            <ui-icon name="trophy" size="xl" class="text-yellow-100" />
          </div>
          <h1 class="text-white text-center text-xl font-bold">Completed!</h1>
        </div>
      </ng-container>

      <div class="p-6 flex flex-col gap-6">
        <!-- XP Reward -->
        <div class="bg-yellow-900/30 border border-yellow-600/40 rounded-xl p-6 text-center">
          <div class="flex items-center justify-center gap-2 mb-3">
            <ui-icon name="star" size="lg" class="text-yellow-400" />
            <span class="text-yellow-200 text-3xl font-bold">+{{ xpReward() }} XP</span>
          </div>
          @if (willLevelUp()) {
          <div class="bg-purple-600 text-white px-4 py-2 rounded-lg inline-block font-semibold">
            Level Up!
          </div>
          }
        </div>

        <!-- XP Progress -->
        <ui-progress-bar
          [current]="newXp()"
          [max]="progress().xpToNextLevel"
          variant="xp"
          label="XP Progress"
        />

        <!-- Feedback Section -->
        <div class="bg-indigo-950/50 rounded-xl p-5 border border-indigo-500/30">
          <h2 class="text-purple-200 text-center mb-4 font-semibold">How was it?</h2>
          <div class="grid w-full grid-cols-2 gap-3">
            <ui-button variant="success" (clicked)="submitFeedback('EASY')"> Easy </ui-button>
            <ui-button variant="primary" (clicked)="submitFeedback('NORMAL')"> Normal </ui-button>
            <ui-button variant="warning" (clicked)="submitFeedback('HARD')"> Hard </ui-button>
            <ui-button variant="danger" (clicked)="submitFeedback('FAILED')"> Failed </ui-button>
          </div>
        </div>
      </div>
    </ui-card>
  `,
})
export class WorkoutFinishComponent {
  private readonly router = inject(Router);
  private readonly userProgressService = inject(UserProgressService);
  private readonly trainingPlanService = inject(TrainingPlanService);
  private readonly workoutStateService = inject(WorkoutStateService);

  readonly progress = this.userProgressService.progress;
  readonly xpReward = this.trainingPlanService.xpReward;

  readonly newXp = computed(() => this.progress().xp + this.xpReward());

  readonly willLevelUp = computed(() => this.newXp() >= this.progress().xpToNextLevel);

  submitFeedback(difficulty: Difficulty): void {
    if (difficulty === 'FAILED') {
      this.userProgressService.recordDifficulty(difficulty);
      this.workoutStateService.reset();
      this.router.navigate(['/workout/failed']);
      return;
    }

    this.userProgressService.awardXp(this.xpReward());

    const shouldSuggest = this.userProgressService.recordDifficulty(difficulty);

    this.workoutStateService.reset();

    if (shouldSuggest) {
      this.router.navigate(['/suggestion']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
