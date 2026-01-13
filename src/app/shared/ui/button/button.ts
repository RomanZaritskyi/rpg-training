import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ui-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      [class]="buttonClasses()"
      (click)="handleClick()"
    >
      <ng-content />
    </button>
  `,
})
export class Button {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly fullWidth = input(false);
  readonly fulHeight = input(false);
  readonly disabled = input(false);
  readonly type = input<'button' | 'submit' | 'reset'>('button');

  readonly clicked = output<void>();

  handleClick(): void {
    if (!this.disabled()) {
      this.clicked.emit();
    }
  }

  readonly hostClasses = computed(() => (this.fullWidth() ? 'block w-full' : 'inline-block'));

  readonly buttonClasses = computed(() => {
    const base =
      'w-full h-full rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-medium';

    const variants: Record<ButtonVariant, string> = {
      primary:
        'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-green-500/50',
      secondary: 'bg-slate-700 hover:bg-slate-600 text-white',
      success: 'bg-green-600 hover:bg-green-700 text-white',
      danger: 'bg-red-600 hover:bg-red-700 text-white',
      warning: 'bg-orange-600 hover:bg-orange-700 text-white',
    };

    const sizes: Record<ButtonSize, string> = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3',
      lg: 'py-4 px-8',
    };

    const disabledStyles = this.disabled() ? 'opacity-50 cursor-not-allowed' : '';

    return `${base} ${variants[this.variant()]} ${sizes[this.size()]} ${disabledStyles}`.trim();
  });
}
