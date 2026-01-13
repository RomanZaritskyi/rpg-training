import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserProgressService } from '../progress/services/user-progress.service';
import { DateService } from '../../core/services/date.service';
import { Card, ProgressBar, Icon, Button } from '../../shared';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, ProgressBar, Icon, Button],
  template: `
    <ui-card>
      <ng-container card-header>
        <div class="bg-linear-to-r from-purple-600 to-indigo-600 p-6">
          <div class="flex items-center gap-3 mb-2">
            <ui-icon name="trophy" size="xl" class="text-yellow-300" />
            <h1 class="text-white text-xl font-bold">RPG Fitness</h1>
          </div>
          <p class="text-purple-100 opacity-90">Today: {{ todayFormatted() }}</p>
        </div>
      </ng-container>

      <div class="p-6 flex flex-col gap-6">
        <!-- Daily Quest -->
        <div class="bg-indigo-950/50 rounded-xl p-5 border border-indigo-500/30">
          <h2 class="text-purple-200 mb-3 font-semibold">Daily Quest</h2>
          <ul class="space-y-2 mb-3">
            <li class="text-slate-300 flex items-start gap-2">
              <span class="text-purple-400 mt-1">•</span>
              <span>Normal training</span>
            </li>
            <li class="text-slate-300 flex items-start gap-2">
              <span class="text-yellow-400 mt-1">•</span>
              <span>+50 XP on completion</span>
            </li>
          </ul>
        </div>

        <!-- Level & XP -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-purple-200">Level: {{ progress().level }}</span>
          </div>
          <ui-progress-bar
            [current]="progress().xp"
            [max]="progress().xpToNextLevel"
            variant="xp"
            label="XP"
          />
        </div>

        <!-- Start Button -->
        <ui-button variant="success" [fullWidth]="true" size="lg" (clicked)="startTraining()">
          Start Training
        </ui-button>
      </div>
    </ui-card>
  `,
})
export class HomeComponent {
  private readonly router = inject(Router);
  private readonly userProgressService = inject(UserProgressService);
  private readonly dateService = inject(DateService);

  readonly progress = this.userProgressService.progress;

  readonly todayFormatted = computed(() => this.dateService.formatTodayShort());

  startTraining(): void {
    this.router.navigate(['/workout/overview']);
  }
}
