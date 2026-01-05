import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserProgressService } from '../../services/user-progress.service';
import { Card, Icon, Button } from '../../../../shared';

@Component({
  selector: 'app-suggestion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, Icon, Button],
  template: `
    <ui-card>
      <ng-container card-header>
        <div class="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
          <div class="flex items-center justify-center gap-3 mb-2">
            <ui-icon name="trending-up" size="xl" class="text-purple-100" />
          </div>
          <h1 class="text-white text-center text-xl font-bold">Suggestion</h1>
        </div>
      </ng-container>

      <div class="p-6 space-y-6">
        <!-- Message -->
        <div class="bg-indigo-950/50 rounded-xl p-5 border border-indigo-500/30">
          <p class="text-purple-100 text-center mb-4">
            You handled it easily twice in a row!
          </p>
          <p class="text-purple-200 text-center mb-4">
            Want to increase reps a bit?
          </p>
          <p class="text-slate-400 text-center text-sm">
            (No extra rounds, just more reps per exercise)
          </p>
        </div>

        <!-- Change Details -->
        <div class="bg-purple-900/30 border border-purple-600/40 rounded-xl p-5">
          <h3 class="text-purple-200 mb-3 text-center font-semibold">Proposed Changes:</h3>
          <div class="space-y-2">
            <div class="flex items-center justify-between bg-slate-800/50 rounded-lg p-3">
              <span class="text-slate-300">Upper body exercises</span>
              <span class="text-green-400 font-medium">+2 reps</span>
            </div>
            <div class="flex items-center justify-between bg-slate-800/50 rounded-lg p-3">
              <span class="text-slate-300">Lower body exercises</span>
              <span class="text-green-400 font-medium">+3 reps</span>
            </div>
          </div>

          @if (repIncrement().upper > 0 || repIncrement().lower > 0) {
            <div class="mt-4 pt-4 border-t border-purple-500/30">
              <p class="text-slate-400 text-sm text-center">
                Current bonus: +{{ repIncrement().upper }} upper, +{{ repIncrement().lower }} lower
              </p>
            </div>
          }
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3">
          <ui-button
            variant="secondary"
            class="flex-1"
            (clicked)="decline()"
          >
            <ui-icon name="x" size="sm" />
            Keep Same
          </ui-button>
          <ui-button
            variant="success"
            class="flex-1"
            (clicked)="accept()"
          >
            <ui-icon name="check" size="sm" />
            Increase
          </ui-button>
        </div>
      </div>
    </ui-card>
  `,
})
export class SuggestionComponent {
  private readonly router = inject(Router);
  private readonly userProgressService = inject(UserProgressService);

  readonly repIncrement = this.userProgressService.repIncrement;

  accept(): void {
    this.userProgressService.increaseReps();
    this.router.navigate(['/']);
  }

  decline(): void {
    this.userProgressService.resetEasyCount();
    this.router.navigate(['/']);
  }
}
