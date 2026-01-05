import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'workout',
    children: [
      {
        path: 'overview',
        loadComponent: () =>
          import('./features/workout/components/workout-overview/workout-overview.component').then(
            (m) => m.WorkoutOverviewComponent
          ),
      },
      {
        path: 'active',
        loadComponent: () =>
          import('./features/workout/components/workout-active/workout-active.component').then(
            (m) => m.WorkoutActiveComponent
          ),
      },
      {
        path: 'finish',
        loadComponent: () =>
          import('./features/workout/components/workout-finish/workout-finish.component').then(
            (m) => m.WorkoutFinishComponent
          ),
      },
    ],
  },
  {
    path: 'suggestion',
    loadComponent: () =>
      import('./features/progress/components/suggestion/suggestion.component').then(
        (m) => m.SuggestionComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
