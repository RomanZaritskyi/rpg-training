import {
	ChangeDetectionStrategy,
	Component,
	computed,
	input,
} from '@angular/core';

export type CardVariant = 'default' | 'highlight' | 'reward';

@Component({
	selector: 'ui-card',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
    <div [class]="cardClasses()">
      @if (hasHeader()) {
        <div [class]="headerClasses()">
          <ng-content select="[card-header]" />
        </div>
      }
      <div class="p-6">
        <ng-content />
      </div>
    </div>
  `,
})
export class Card {
	readonly variant = input<CardVariant>('default');
	readonly headerGradient = input<string>('from-purple-600 to-indigo-600');
	readonly hasHeader = input(false);

	readonly cardClasses = computed(() => {
		const base =
			'bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-purple-500/30 overflow-hidden';

		const variants: Record<CardVariant, string> = {
			default: '',
			highlight: 'border-indigo-500/30 bg-indigo-950/50',
			reward: 'border-yellow-600/40 bg-yellow-900/30',
		};

		return `${base} ${variants[this.variant()]}`;
	});

	readonly headerClasses = computed(() => {
		return `bg-gradient-to-r ${this.headerGradient()} p-6`;
	});
}
