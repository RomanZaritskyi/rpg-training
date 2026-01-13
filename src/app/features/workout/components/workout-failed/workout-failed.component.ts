import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Card, Button } from '../../../../shared';

@Component({
  selector: 'app-workout-failed',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, Button],
  template: `
    <ui-card>
      <ng-container card-header>
        <div class="bg-linear-to-r from-slate-700 to-slate-900 p-6">
          <h1 class="text-white text-center text-xl font-bold">Workout Complete</h1>
        </div>
      </ng-container>

      <div class="p-6 space-y-6">
        <div class="bg-slate-900/40 border border-slate-600/40 rounded-xl p-6 text-center">
          <p class="text-slate-100 text-lg font-medium">
            "Today's result does not define your potential."
          </p>
        </div>

        <div class="grid w-full grid-cols-1">
          <ui-button variant="primary" (clicked)="goHome()"> Back to Home </ui-button>
        </div>
      </div>
    </ui-card>
  `,
})
export class WorkoutFailedComponent {
  private readonly router = inject(Router);

  goHome(): void {
    this.router.navigate(['/']);
  }
}
