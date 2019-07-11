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

	private createTimeObject(date: Date): Time {
	    let time: Time = {days: 0, hours: 0, minutes: 0, seconds: 0, text: ''};
			time.text = moment(date).fromNow();

	    return time;
	}

	timer(date: Date, intervalAmount: number = 1000): Observable<Time> {
		return interval(intervalAmount).map(() => this.createTimeObject(date));
	}

	countDownTimer(timeLeft: number = 30, intervalAmount: number = 1000) {
		return interval(intervalAmount).map(() => {
			return timeLeft--;
		});
	}
}