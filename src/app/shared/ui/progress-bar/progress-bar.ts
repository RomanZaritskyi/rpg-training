import {
	ChangeDetectionStrategy,
	Component,
	computed,
	input,
} from '@angular/core';

export type ProgressBarVariant = 'xp' | 'health' | 'timer';

@Component({
	selector: 'ui-progress-bar',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
    <div class="space-y-2">
      @if (showLabel()) {
        <div class="flex items-center justify-between">
          <span class="text-purple-200">{{ label() }}</span>
          <span class="text-purple-200">
            {{ current() }}/{{ max() }}
          </span>
        </div>
      }
      <div class="w-full bg-slate-800 rounded-full h-4 overflow-hidden border border-purple-500/30">
        <div
          [class]="barClasses()"
          [style.width.%]="percentage()"
        ></div>
      </div>
    </div>
  `,
})
export class ProgressBar {
	readonly current = input.required<number>();
	readonly max = input.required<number>();
	readonly variant = input<ProgressBarVariant>('xp');
	readonly label = input<string>('');
	readonly showLabel = input(true);
	readonly animated = input(true);

	readonly percentage = computed(() => {
		const pct = (this.current() / this.max()) * 100;
		return Math.min(Math.max(pct, 0), 100);
	});

	readonly barClasses = computed(() => {
		const base = 'h-full rounded-full';
		const animation = this.animated() ? 'transition-all duration-500' : '';

		const variants: Record<ProgressBarVariant, string> = {
			xp: 'bg-gradient-to-r from-purple-500 to-pink-500',
			health: 'bg-gradient-to-r from-green-500 to-emerald-500',
			timer: 'bg-gradient-to-r from-blue-500 to-cyan-500',
		};

		return `${base} ${animation} ${variants[this.variant()]}`;
	});
}
