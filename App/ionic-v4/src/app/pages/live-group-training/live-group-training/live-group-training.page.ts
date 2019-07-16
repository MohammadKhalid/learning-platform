import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';

import { RtcService } from '../../../services/rtc/rtc.service';
import { RestApiService } from '../../../services/http/rest-api.service';
import { AuthenticationService } from '../../../services/user/authentication.service';
import { TimerService } from '../../../services/timer/timer.service';

import { DEFAULT_TIMEZONE } from '../../../../environments/environment';

import * as moment from 'moment';
import 'moment-timezone';

@Component({
	selector: 'app-live-group-training',
	templateUrl: './live-group-training.page.html',
	styleUrls: ['./live-group-training.page.scss'],
})
export class LiveGroupTrainingPage implements OnInit {

	connection: any;
	socket: any;

	publicRoomIdentifier: string = 'live-group-training';
	items: any = [];
	sessionData: any;
	queryParams: any = {};
	searchBoxToolbarHidden: boolean = true;
	didSearch: boolean = false;
	segmentFilter: string = 'today';
	isInfiniteScrollDisabled: boolean = false;

	constructor(
		private alertCtrl: AlertController,
		private navCtrl: NavController,
		private restApi: RestApiService,
		private rtcService: RtcService,
		private authService: AuthenticationService,
		private timerService: TimerService
	) {
		// set query params
		this.setQueryParamsDefault();
		// moment.tz.setDefault('Australia/Sydney')
		// get user data
		this.sessionData = this.authService.getSessionData();
	}

	ngOnInit() {
		// rtc connection
		this.rtcService.getConnection().then((connection) => {
			// set connection
			this.connection = connection;

			// get set socket
			this.connection.getSocket((socket) => {
				this.socket = socket;

				// connection socket events
				this.socketEvent();

				// set connection custom event
				this.connection.setCustomSocketEvent(this.publicRoomIdentifier);

				// load items
				this.loadData();
			});
		});
	}

	socketEvent() {
		// socket event
		this.socket.on(this.publicRoomIdentifier, (message: any) => {
			console.log('CUSTOM SOCKET EVENT MESSAGE', message);

			switch (message.type) {
				case 'opened':
					this.getRoom(message.roomid).then((roomIndex: any) => {
						if (roomIndex >= 0) {
							if (this.items[roomIndex]) {
								this.items[roomIndex].started = message.started;
								this.items[roomIndex].status = 'open';
							}
						}
					});

					break;
				case 'join':
					this.getRoom(message.roomid).then((roomIndex: any) => {
						if (roomIndex >= 0) {
							if (this.items[roomIndex]) {
								if (message.speaker) this.items[roomIndex].isSpeakerJoin = true;
							}
						}
					});
					break;
				case 'leave':
					this.getRoom(message.roomid).then((roomIndex: any) => {
						if (roomIndex >= 0) {
							// update room status
							if (this.items[roomIndex]) {
								this.items[roomIndex].status = message.status;
								if (message.speaker) this.items[roomIndex].isSpeakerJoin = false;
							}
						}
					});
					break;
				default:
					break;
			}
		});
	}

	setQueryParamsDefault() {
		this.queryParams = { pageNumber: 0, limit: 6 };
	}

	loadData(event?: any) {
		console.log('LOAD EVENT ', event);
		console.log('QPARAMS ', this.queryParams);

		this.restApi.get('live-group-trainings', this.queryParams).subscribe((resp: any) => {
			// set time left timer
			for (let item of resp.items) {
				// time left counter
				// item['timeLeft'] = this.timerService.timer(moment(item.date + ' ' + item.time).tz('Australia/Sydney').toISOString());
				item['timeLeft'] = this.timerService.timer(item.date+" "+item.time,item.timezone);
			}

			// push items
			this.items = this.items.concat(resp.items);

			if (resp.items.length > 0) {
				// update pagi
				this.queryParams.pageNumber++;

				// update room options
				if (this.connection.socket) this.connection.socket.emit('get-public-rooms', this.publicRoomIdentifier, (listOfRooms) => {
					listOfRooms.forEach((room) => {
						this.getRoom(room.sessionid).then((roomIndex: any) => {
							if (roomIndex >= 0) {
								// speaker is in room flag
								if (this.items[roomIndex]) this.items[roomIndex].isSpeakerJoin = true;
							}
						});
					});
				});
			}

			// enable infinite scroll
			if (this.isInfiniteScrollDisabled) this.isInfiniteScrollDisabled = false;

			// hide loading indicator
			if (event && event.type === 'ionInfinite') {
				setTimeout(() => {
					event.target.complete();

					// App logic to determine if all data is loaded
					// and disable the infinite scroll
					// if (data.length == 1000) {
					// 	event.target.disabled = true;
					// }	
				}, 500);
			}
		});
	}

	async getRoom(roomId: string) {
		for (let i = this.items.length - 1; i >= 0; i--) {
			if (this.items[i].id == roomId) return i;
		}

		return null;
	}

	getPublicRooms(): void {
		//if(!this.items.length) return;

		this.connection.socket.emit('get-public-rooms', this.publicRoomIdentifier, (listOfRooms) => {
			this.updateListOfRooms(listOfRooms);
			//setTimeout(() => { this.looper(), 3000});
		});
	}

	updateListOfRooms(rooms: any): void {
		// if (!rooms.length) return;

		// set rooms
		// this.items = rooms;
	}

	openCanvasDesigner(isInitiator: boolean, sessionid: string): void {
		let href: string = '/live-group-training/session?open=' + isInitiator + '&sessionid=' + sessionid;

		this.navCtrl.navigateForward(href);
	}

	joinRoom(room: any) {
		// this.connection.isInitiator = false;
		// this.connection.sessionid = room.sessionid;

		// this.navCtrl.navigateForward('/live-group-training/session');

		this.openCanvasDesigner(false, room.sessionid);
	}

	canAdd() {
		return this.sessionData.user.type == 'admin' || this.sessionData.user.type == 'coach' ? true : false;
	}

	gotoSession(id: string) {
		this.navCtrl.navigateRoot('/live-group-training/session', { state: { id: id } });
	}

	canJoin(room: any) {
		if (
			this.sessionData.user.type === 'admin' ||
			room.participants.includes(this.sessionData.user.id) ||
			room.speakerId === this.sessionData.user.id ||
			room.public === true
		) return true;

		return false;
	}

	itemColor(i: number) {
		console.log('ROW ', i, this.items.length);
		return i % this.items.length === 1 ? 'medium' : '';
	}

	showHideSearchBox() {
		this.searchBoxToolbarHidden = this.searchBoxToolbarHidden ? false : true;
	}

	startSearch(event: any) {
		// ignore
		if (!event.detail.value) return;

		// disable infinite scroll
		this.isInfiniteScrollDisabled = true;

		// reset
		this.resetAll().then(() => {
			// set query
			this.queryParams.searchQuery = event.detail.value.trim();

			// query
			this.loadData(event);

			// flag search state
			this.didSearch = true;
		});
	}

	closeSearch(event: any) {
		// reset
		if (this.didSearch) {
			this.resetAll().then(() => {
				// query
				this.loadData(event);
			});
		}

		// flag search state
		this.didSearch = false;

		this.showHideSearchBox();
	}

	async resetAll() {
		// set query params
		this.setQueryParamsDefault();

		// reset items
		this.items = [];
	}

	async showFilter() {
		const alert = await this.alertCtrl.create({
			header: 'Sort / Filter',
			inputs: [
				{
					name: 'checkbox1',
					type: 'checkbox',
					label: 'Title',
					value: 'value1',
					checked: true
				},

				{
					name: 'checkbox2',
					type: 'checkbox',
					label: 'Date',
					value: 'value2'
				}
			],
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
					cssClass: 'secondary',
					handler: () => { }
				}, {
					text: 'OK',
					handler: () => {
					}
				}
			]
		});

		await alert.present();
	}

	beautifyDate(date: string, format: string = 'MMMM D, YYYY', timezone?: string) {
		return timezone && moment.tz.names().includes(timezone) ? moment(moment.tz(date, 'YYYY-MM-DD HH:mm', timezone).utc().toISOString()).format(format) : moment(date).format(format);
		// return moment(date).tz(DEFAULT_TIMEZONE).format(format);
	}

	makeDate(date,format,timezone){
		// if (timezone == moment.tz.guess()) {
		// 	return moment(date).format(format)
		// }else{

		// }
		return moment(date).format(format)
	}
}