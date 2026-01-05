import { computed, Injectable, inject } from '@angular/core';
import { UserProgressService } from '../../progress/services/user-progress.service';
import type { Block } from '../models/workout.models';

export interface TrainingPlan {
	id: string;
	name: string;
	type: 'NORMAL' | 'HARD';
	xpReward: number;
	blocks: Block[];
}

@Injectable({
	providedIn: 'root',
})
export class TrainingPlanService {
	private readonly userProgress = inject(UserProgressService);

	readonly currentPlan = computed<TrainingPlan>(() => {
		const increment = this.userProgress.repIncrement();

		return {
			id: 'normal-training',
			name: 'Normal Training',
			type: 'NORMAL',
			xpReward: 50,
			blocks: [
				{
					name: 'Warm-up',
					type: 'warmup',
					duration: '~5 min',
				},
				{
					name: 'Run',
					type: 'run',
					distance: '2–3 km',
				},
				{
					name: 'Strength',
					type: 'strength',
					rounds: 4,
					exercises: [
						{ name: 'Push-ups', reps: 15 + increment.upper },
						{ name: 'Squats', reps: 20 + increment.lower },
						{ name: 'Abs', reps: 20 + increment.lower },
						{ name: 'Pull-ups', reps: 5 + increment.upper },
					],
				},
				{
					name: 'Cooldown',
					type: 'cooldown',
					duration: '~5 min',
				},
			],
		};
	});

	readonly blocks = computed(() => this.currentPlan().blocks);
	readonly xpReward = computed(() => this.currentPlan().xpReward);
	readonly planName = computed(() => this.currentPlan().name);
	readonly planType = computed(() => this.currentPlan().type);
}
