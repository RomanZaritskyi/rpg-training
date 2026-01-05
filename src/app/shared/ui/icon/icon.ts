import {
	ChangeDetectionStrategy,
	Component,
	computed,
	input,
} from '@angular/core';

export type IconName =
	| 'trophy'
	| 'flame'
	| 'arrow-left'
	| 'play'
	| 'pause'
	| 'award'
	| 'check-circle'
	| 'timer'
	| 'star'
	| 'trending-up'
	| 'x'
	| 'check';

export type IconSize = 'sm' | 'md' | 'lg' | 'xl';

const ICON_PATHS: Record<IconName, string> = {
	trophy:
		'M8 21h8m-4-4v4m-4.5-9.5a4.5 4.5 0 009 0V5a2 2 0 00-2-2H9.5a2 2 0 00-2 2v6.5zM5 7H3a1 1 0 00-1 1v2a4 4 0 004 4m12-7h2a1 1 0 011 1v2a4 4 0 01-4 4',
	flame:
		'M12 23c-3.866 0-7-3.134-7-7 0-2.5 1.5-5 3-6.5.378-.378.89-.5 1.363-.325.474.174.637.599.637 1.075v2.25c0 .414.336.75.75.75s.75-.336.75-.75V7c0-.69.56-1.25 1.25-1.25.345 0 .657.14.883.367L17 10c1.5 2 2 4 2 6 0 3.866-3.134 7-7 7z',
	'arrow-left': 'M10 19l-7-7m0 0l7-7m-7 7h18',
	play: 'M8 5v14l11-7z',
	pause: 'M6 4h4v16H6V4zm8 0h4v16h-4V4z',
	award:
		'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
	'check-circle': 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
	timer: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
	star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
	'trending-up': 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
	x: 'M6 18L18 6M6 6l12 12',
	check: 'M5 13l4 4L19 7',
};

const FILLED_ICONS: IconName[] = ['play', 'pause', 'flame', 'star'];

@Component({
	selector: 'ui-icon',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
    <svg
      [class]="sizeClasses()"
      [attr.fill]="isFilled() ? 'currentColor' : 'none'"
      [attr.stroke]="isFilled() ? 'none' : 'currentColor'"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        [attr.d]="iconPath()"
      />
    </svg>
  `,
})
export class Icon {
	readonly name = input.required<IconName>();
	readonly size = input<IconSize>('md');

	readonly iconPath = computed(() => ICON_PATHS[this.name()] ?? '');

	readonly isFilled = computed(() => FILLED_ICONS.includes(this.name()));

	readonly sizeClasses = computed(() => {
		const sizes: Record<IconSize, string> = {
			sm: 'w-4 h-4',
			md: 'w-5 h-5',
			lg: 'w-6 h-6',
			xl: 'w-8 h-8',
		};
		return sizes[this.size()];
	});
}
