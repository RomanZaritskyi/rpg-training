import { isPlatformBrowser } from '@angular/common';
import { Injectable, inject, PLATFORM_ID } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class StorageService {
	private readonly platformId = inject(PLATFORM_ID);
	private readonly isBrowser = isPlatformBrowser(this.platformId);

	get<T>(key: string, defaultValue: T): T {
		if (!this.isBrowser) {
			return defaultValue;
		}

		const stored = localStorage.getItem(key);
		if (stored === null) {
			return defaultValue;
		}

		try {
			return JSON.parse(stored) as T;
		} catch {
			return defaultValue;
		}
	}

	set<T>(key: string, value: T): void {
		if (this.isBrowser) {
			localStorage.setItem(key, JSON.stringify(value));
		}
	}

	remove(key: string): void {
		if (this.isBrowser) {
			localStorage.removeItem(key);
		}
	}

	clear(): void {
		if (this.isBrowser) {
			localStorage.clear();
		}
	}
}
