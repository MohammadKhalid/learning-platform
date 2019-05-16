import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

import { SOCKET_URL } from '../../../environments/environment';

import RTCMultiConnection from 'rtcmulticonnection';
import adapter from 'webrtc-adapter';
import io from 'socket.io-client';
// import { forEach } from '@angular/router/src/utils/collection';
import 'rxjs/add/operator/map';

(<any>window).io = io;

@Injectable({
  providedIn: 'root'
})
export class RtcService {

	connectionSocket: io;
	socketUrl: string = SOCKET_URL;
	channel: string = 'thrive19';
	log: boolean = true;
	iceServers: any = {
		stuns: [
			// { urls: 'stun:numb.viagenie.ca' },
			{ urls: 'stun:stun.l.google.com:19302' },
			{ url:'stun:stun1.l.google.com:19302' },
			{ url:'stun:stun2.l.google.com:19302' },
			{ url:'stun:stun3.l.google.com:19302' },
			{ url:'stun:stun4.l.google.com:19302' }
		],
		// turn: {
		// 	urls: 'turn:numb.viagenie.ca',
		// 	credential: 'fadqyv-nijwu8-Tubnyc',
		// 	username: 'manvillt.developer@gmail.com'
		// },
		turns: [
			{
				urls: 'turn:thrive19.com:3478',
				credential: 'fadqyvnijwu8Tubnyc',
				username: 'thrive19'
			},
			{
				urls: 'turn:thrive19.com:5349',
				credential: 'fadqyvnijwu8Tubnyc',
				username: 'thrive19'
			}
		]
	};
// fadqyvnijwu8Tubnyc
	constructor(
		private toastCtrl: ToastController
	) {}

	initConnection() {
		this.createConnection().then((connection) => {
			connection.connectSocket((socket) => {
				this.connectionSocket = socket;
			});
		});
	}

	async createConnection() {
		let connection = new RTCMultiConnection();

		// log event
		connection.enableLogs = this.log;

		// set channel
		connection.channel = this.channel;

		// ice
		connection.candidates = { turn: true };
		connection.iceTransportPolicy = 'relay';

		// connect socket
		connection.socketURL = this.socketUrl;

		// STUN+TURN servers
		connection.iceServers = [];

		for (let index = 0; index < this.iceServers.stuns.length; index++) {
			connection.iceServers.push(this.iceServers.stuns[index]);
		}

		for (let index = 0; index < this.iceServers.turns.length; index++) {
			connection.iceServers.push(this.iceServers.turns[index]);
		}

		return connection;
	}

	getConnectionSocket() {
		return this.connectionSocket;
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