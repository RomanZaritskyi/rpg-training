import { isPlatformBrowser } from '@angular/common';
import { Injectable, inject, PLATFORM_ID } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class DateService {
	private readonly platformId = inject(PLATFORM_ID);
	private readonly isBrowser = isPlatformBrowser(this.platformId);

	getToday(): Date {
		return new Date();
	}

	getTodayString(): string {
		return this.getToday().toDateString();
	}

	getYesterdayString(): string {
		const yesterday = new Date(Date.now() - 86400000);
		return yesterday.toDateString();
	}

	formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
		if (!this.isBrowser) {
			return '';
		}

		const defaultOptions: Intl.DateTimeFormatOptions = {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
		};

		return date.toLocaleDateString('en-US', options ?? defaultOptions);
	}

	formatTodayShort(): string {
		return this.formatDate(this.getToday());
	}
}
