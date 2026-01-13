import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TrainingPlanService } from '../../services/training-plan.service';
import { WorkoutStateService } from '../../services/workout-state.service';
import { Card, Icon, Button } from '../../../../shared';

@Component({
  selector: 'app-workout-overview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, Icon, Button],
  template: `
    <ui-card>
      <ng-container card-header>
        <div class="bg-linear-to-r from-indigo-600 to-blue-600 p-6">
          <h1 class="text-white text-center text-xl font-bold">
            Today's Training ({{ planType() }})
          </h1>
        </div>
      </ng-container>

      <div class="p-6 space-y-6">
        <!-- Blocks List -->
        <div>
          <h2 class="text-purple-200 mb-4 font-semibold">Blocks</h2>
          <div class="space-y-3">
            @for (block of blocks(); track $index) {
            <div class="bg-indigo-950/50 rounded-lg p-4 border border-indigo-500/30">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div
                    class="bg-purple-600 rounded-full w-8 h-8 flex items-center justify-center text-white text-sm font-medium"
                  >
                    {{ $index + 1 }}
                  </div>
                  <div>
                    <div class="text-white font-medium">{{ block.name }}</div>
                    <div class="text-purple-300 text-sm">
                      @if (block.duration) { {{ block.duration }} } @if (block.distance) {
                      {{ block.distance }} } @if (block.rounds) { {{ block.rounds }} rounds }
                    </div>
                  </div>
                </div>
              </div>

              @if (block.exercises) {
              <div class="mt-3 ml-11 space-y-1">
                @for (exercise of block.exercises; track exercise.name) {
                <div class="text-slate-400 text-sm">
                  • {{ exercise.name }} x {{ exercise.reps }}
                </div>
                }
              </div>
              }
            </div>
            }
          </div>
        </div>

        <!-- Reward -->
        <div
          class="bg-yellow-900/30 border border-yellow-600/40 rounded-xl p-4 flex items-center gap-3"
        >
          <ui-icon name="award" size="lg" class="text-yellow-400" />
          <span class="text-yellow-200">Reward: +{{ xpReward() }} XP</span>
        </div>

        <!-- Buttons -->
        <div class="grid w-full grid-cols-2 gap-3">
          <ui-button variant="secondary" (clicked)="goBack()">
            <ui-icon name="arrow-left" size="sm" />
            Back
          </ui-button>
          <ui-button variant="success" (clicked)="startWorkout()">
            <ui-icon name="play" size="sm" />
            Start
          </ui-button>
        </div>
      </div>
    </ui-card>
  `,
})
export class WorkoutOverviewComponent {
  private readonly router = inject(Router);
  private readonly trainingPlanService = inject(TrainingPlanService);
  private readonly workoutStateService = inject(WorkoutStateService);

  readonly blocks = this.trainingPlanService.blocks;
  readonly xpReward = this.trainingPlanService.xpReward;
  readonly planType = this.trainingPlanService.planType;

  goBack(): void {
    this.router.navigate(['/']);
  }

  startWorkout(): void {
    this.workoutStateService.startWorkout(this.blocks());
    this.router.navigate(['/workout/active']);
  }
}
