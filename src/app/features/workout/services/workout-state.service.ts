import { computed, Injectable, signal } from '@angular/core';
import type { Block } from '../models/workout.models';

@Injectable({
	providedIn: 'root',
})
export class WorkoutStateService {
	readonly isActive = signal(false);
	readonly isPaused = signal(false);
	readonly currentBlockIndex = signal(0);
	readonly currentRound = signal(1);
	readonly elapsedTime = signal(0);

	private blocksRef = signal<Block[]>([]);

	readonly currentBlock = computed(() => {
		const blocks = this.blocksRef();
		const index = this.currentBlockIndex();
		return blocks[index] ?? null;
	});

	readonly isLastBlock = computed(() => {
		const blocks = this.blocksRef();
		return this.currentBlockIndex() === blocks.length - 1;
	});

	readonly totalBlocks = computed(() => this.blocksRef().length);

	readonly blockProgress = computed(() => ({
		current: this.currentBlockIndex() + 1,
		total: this.totalBlocks(),
	}));

	startWorkout(blocks: Block[]): void {
		this.blocksRef.set(blocks);
		this.currentBlockIndex.set(0);
		this.currentRound.set(1);
		this.elapsedTime.set(0);
		this.isPaused.set(false);
		this.isActive.set(true);
	}

	completeBlock(): 'next-round' | 'next-block' | 'finished' {
		const block = this.currentBlock();

		if (block?.type === 'strength' && block.rounds) {
			if (this.currentRound() < block.rounds) {
				this.currentRound.update((r) => r + 1);
				return 'next-round';
			}
		}

		if (!this.isLastBlock()) {
			this.currentBlockIndex.update((i) => i + 1);
			this.currentRound.set(1);
			return 'next-block';
		}

		return 'finished';
	}

	togglePause(): void {
		this.isPaused.update((p) => !p);
	}

	tick(): void {
		if (!this.isPaused()) {
			this.elapsedTime.update((t) => t + 1);
		}
	}

	incrementTime(): void {
		this.elapsedTime.update((t) => t + 1);
	}

	reset(): void {
		this.isActive.set(false);
		this.isPaused.set(false);
		this.currentBlockIndex.set(0);
		this.currentRound.set(1);
		this.elapsedTime.set(0);
		this.blocksRef.set([]);
	}
}
