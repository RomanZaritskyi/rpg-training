import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  type OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import { Router } from '@angular/router';
import { WorkoutStateService } from '../../services/workout-state.service';
import { TrainingPlanService } from '../../services/training-plan.service';
import { Card, Icon, Button } from '../../../../shared';
import { FormatTimePipe } from '../../../../shared/pipes/format-time.pipe';

@Component({
  selector: 'app-workout-active',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, Icon, Button, FormatTimePipe],
  template: `
    <ui-card>
      <ng-container card-header>
        <div class="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
          <h1 class="text-white text-center text-xl font-bold mb-2">Workout in Progress</h1>
          <p class="text-green-100 text-center">
            Block {{ currentBlockIndex() + 1 }}/{{ blocks().length }}: {{ currentBlock().name }}
          </p>
        </div>
      </ng-container>

      <div class="p-6 space-y-6">
        <!-- Round indicator for strength blocks -->
        @if (currentBlock().type === 'strength' && currentBlock().rounds) {
          <div class="text-center">
            <div class="inline-block bg-purple-600 rounded-full px-6 py-3">
              <span class="text-white font-medium">
                Round {{ currentRound() }} of {{ currentBlock().rounds }}
              </span>
            </div>
          </div>
        }

        <!-- Exercise List -->
        <div class="bg-indigo-950/50 rounded-xl p-5 border border-indigo-500/30 min-h-[200px]">
          @if (currentBlock().exercises) {
            <div class="space-y-3">
              @for (exercise of currentBlock().exercises; track exercise.name) {
                <div class="flex items-center justify-between py-3 border-b border-indigo-500/20 last:border-b-0">
                  <span class="text-white">{{ exercise.name }}</span>
                  <span class="text-purple-300 font-medium">x {{ exercise.reps }}</span>
                </div>
              }
            </div>
          } @else {
            <div class="flex items-center justify-center h-full min-h-[150px]">
              <div class="text-center">
                <p class="text-white text-lg mb-2">{{ currentBlock().name }}</p>
                @if (currentBlock().duration) {
                  <p class="text-purple-300">{{ currentBlock().duration }}</p>
                }
                @if (currentBlock().distance) {
                  <p class="text-purple-300">{{ currentBlock().distance }}</p>
                }
              </div>
            </div>
          }
        </div>

        <!-- Timer -->
        <div class="bg-slate-800/50 rounded-xl p-4 border border-slate-600/30">
          <div class="flex items-center justify-center gap-3">
            <ui-icon
              name="timer"
              size="lg"
              [class]="isPaused() ? 'text-orange-400' : 'text-green-400'"
            />
            <span class="text-white text-2xl font-mono">{{ elapsedTime() | formatTime }}</span>
            @if (isPaused()) {
              <span class="bg-orange-600 text-white text-sm px-3 py-1 rounded-full">
                Paused
              </span>
            }
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3">
          <ui-button
            variant="success"
            class="flex-1"
            size="lg"
            (clicked)="completeBlock()"
          >
            <ui-icon name="check-circle" size="sm" />
            {{ buttonText() }}
          </ui-button>
          <ui-button
            [variant]="isPaused() ? 'success' : 'warning'"
            size="lg"
            (clicked)="togglePause()"
          >
            <ui-icon [name]="isPaused() ? 'play' : 'pause'" size="sm" />
          </ui-button>
        </div>
      </div>
    </ui-card>
  `,
})
export class WorkoutActiveComponent implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly workoutStateService = inject(WorkoutStateService);
  private readonly trainingPlanService = inject(TrainingPlanService);
  private timerInterval: ReturnType<typeof setInterval> | null = null;

  readonly blocks = this.trainingPlanService.blocks;
  readonly currentBlockIndex = this.workoutStateService.currentBlockIndex;
  readonly currentRound = this.workoutStateService.currentRound;
  readonly isPaused = this.workoutStateService.isPaused;
  readonly elapsedTime = this.workoutStateService.elapsedTime;

  readonly currentBlock = computed(() => this.blocks()[this.currentBlockIndex()]);

  readonly buttonText = computed(() => {
    const block = this.currentBlock();
    const isStrengthWithMoreRounds =
      block.type === 'strength' &&
      block.rounds &&
      this.currentRound() < block.rounds;
    const isLastBlock = this.currentBlockIndex() === this.blocks().length - 1;

    if (isStrengthWithMoreRounds) {
      return 'Next Round';
    }
    return isLastBlock ? 'Finish Workout' : 'Next Block';
  });

  constructor() {
    effect(() => {
      const paused = this.isPaused();

      if (isPlatformBrowser(this.platformId)) {
        if (!paused) {
          this.startTimer();
        } else {
          this.stopTimer();
        }
      }
    });
  }

  private startTimer(): void {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      this.workoutStateService.incrementTime();
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  completeBlock(): void {
    const result = this.workoutStateService.completeBlock();
    if (result === 'finished') {
      this.router.navigate(['/workout/finish']);
    }
  }

  togglePause(): void {
    this.workoutStateService.togglePause();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }
}
