import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

import { RTC_SIGNALLING_SERVER_URL, ICE_SERVERS } from '../../../environments/environment';

import RTCMultiConnection from 'rtcmulticonnection';
import adapter from 'webrtc-adapter';
import io from 'socket.io-client';
import 'rxjs/add/operator/map';

(<any>window).io = io;

@Injectable({
  providedIn: 'root'
})
export class RtcService {

	connection: RTCMultiConnection;
	socketUrl: string = RTC_SIGNALLING_SERVER_URL;
	channel: string = 'thrive19';
	extra: any;
	log: boolean = true;

	constructor(
		private toastCtrl: ToastController
	) {}

	async initConnection(options?: any) {
		let connection = new RTCMultiConnection();

		// extra
		if(options && options.hasOwnProperty('extra')) {
			connection.extra = options.extra;
			this.extra = options.extra;
		} else if(this.extra) {
			connection.extra = this.extra;
		}

		// log event
		connection.enableLogs = this.log;

		// set channel
		connection.channel = this.channel;

		// socket options
		connection.socketOptions = {
			'forceNew': true, // For SocketIO version >= 1.0
			'transport': 'polling' // fixing transport:unknown issues
		};

		// connect socket
		connection.socketURL = this.socketUrl;

		// ICE servers
		if(ICE_SERVERS) {
			connection.candidates = ICE_SERVERS.candidates;
			connection.iceTransportPolicy = ICE_SERVERS.transportPolicy;

			connection.iceServers = [];
			connection.iceServers.push(ICE_SERVERS.stun);
			connection.iceServers.push(ICE_SERVERS.turn);
		}

		this.connection = connection;

		console.log('CONN INITIATED', this.connection);
	}

	async getConnection() {
		return this.connection;
	}

	// async create(params: any = {}) {
	// 	// if(this.connection) return this.connection;

	// 	let connection = new RTCMultiConnection();

	// 	// default channel
	// 	connection.channel = this.channel;

	// 	// socket url
	// 	connection.socketURL = this.socketUrl;

	// 	// STUN+TURN servers
	// 	connection.iceServers = [];
	// 	connection.iceServers.push(this.iceServers.stun);
	// 	connection.iceServers.push(this.iceServers.turn);

	// 	// default extra
	// 	connection.extra = this.connection ? this.connection.extra : {};

	// 	// set params
	// 	for (const key in params) {
	// 		if (params.hasOwnProperty(key)) {
	// 			if(this.connectionConfigMergeKey.includes(key)) {
	// 				connection[key] = { ...connection[key], ...params[key] };
	// 			} else {
	// 				connection[key] = params[key];
	// 			}
	// 		} else {
	// 			connection[key] = params[key];
	// 		}
	// 	}

	// 	return connection;
	// }

	connectSocket(): void {
		// this.connection.connectSocket((socket) => {
			// socket.on('disconnect', () => {
	        // 	console.log('SOCKET DISCONNECTED');
	        // });

			// show time submitted socket event
			// this.connection.setCustomSocketEvent('show-time-created');
			// this.connection.socket.on('show-time-created', (message) => {
			// 	if(message.submittedTo === this.userData.id) {
			// 		this.showToastMsg('New ' + message.type + ' Time submitted!');
			// 	}
			// });

			// show time reviewed socket event
			// this.connection.setCustomSocketEvent('show-time-reviewed');
			// this.connection.socket.on('show-time-reviewed', (message) => {
			// 	if(message.userId === this.userData.id) {
			// 		this.showToastMsg(message.type + ' Time - ' + message.title +  ' has been reviewed!');
			// 	}
			// });

			// ask expert message socket event
			// this.connection.setCustomSocketEvent('ask-expert-message');
			// this.connection.socket.on('ask-expert-message', (message) => {
			// 	// if(message.userId === this.userData.id) {
			// 	// 	this.showToastMsg(message.type + ' Time - ' + message.title +  ' has been reviewed!');
			// 	// }
			// });

			// test socket event
			// this.connection.setCustomSocketEvent('test');
			// this.connection.socket.on('test', (message) => {
			// 	this.showToastMsg(message);
			// });
		// });
	}

	emitShowTimeCreated(message) {
		// this.connection.socket.emit('show-time-created', message);
	}

	emitShowTimeReviewed(message) {
		// this.connection.socket.emit('show-time-reviewed', message);
	}

	emitAskExpertQuestionAnswer(message) {
		// this.connection.socket.emit('ask-expert-message', message);
	}

	emitTest(message) {
		// this.connection.socket.emit('test', message);
	}

	// async getSocketConnection() {
	// 	return this.socketConnection;
	// }

	// async getConnection() {
	// 	console.log('GET CONN', this.connection);

	// 	return this.connection;
	// }

	// setSocketConnectionCustomEvent(eventName: string) {
	// 	this.connection.setCustomSocketEvent(eventName);
	// }

	async showToastMsg(msg: string) {
		const toast = await this.toastCtrl.create({
			message: msg,
			position: 'bottom',
			closeButtonText: 'OK',
			showCloseButton: true
		});

		toast.present();
	}

	// disconnect(): void {
	// 	this.connection.disconnect();
	// 	console.log('RTC CONNECTION DISCONNECTED', this.connection);
	// }
}