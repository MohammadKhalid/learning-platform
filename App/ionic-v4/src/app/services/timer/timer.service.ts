import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { interval } from 'rxjs';

import 'rxjs/add/observable/defer';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/map';

import * as moment from 'moment';

export interface Time {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	text: string
}

@Injectable({
	providedIn: 'root'
})
export class TimerService {

	constructor() {}

		private createTimeObject(date: Date, timezone) {
		let time = { days: 0, hours: 0, minutes: 0, seconds: 0, text: '', date: '' }
		if (timezone == moment.tz.guess()) {
			time.text = moment(date, "HH:mm").fromNow();
		} else {
			let now = moment.utc();
			let currentTimeZoneOff = moment.tz.zone(moment.tz.guess()).utcOffset(Number(now));
			let serverTimeZoneOff = moment.tz.zone(timezone).utcOffset(Number(now));
			let difference = (serverTimeZoneOff - currentTimeZoneOff) / 60
			time.text = moment(date, "YYYY-MM-DD HH:mm").add(difference, 'hours').fromNow();
		}
		
		return time;
	}

	// timer(date: Date, intervalAmount: number = 1000): Observable<Time> {
	// 	return interval(intervalAmount).map(() => this.createTimeObject(date));
	// }

	timer(date, timezone, intervalAmount: number = 1000) {
		return interval(intervalAmount).map(() => this.createTimeObject(date, timezone));
	}

	countDownTimer(timeLeft: number = 30, intervalAmount: number = 1000) {
		return interval(intervalAmount).map(() => {
			return timeLeft--;
		});
	}
}