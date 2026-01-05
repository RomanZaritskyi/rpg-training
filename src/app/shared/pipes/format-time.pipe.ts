import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
	name: 'formatTime',
	pure: true,
})
export class FormatTimePipe implements PipeTransform {
	transform(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}
}
