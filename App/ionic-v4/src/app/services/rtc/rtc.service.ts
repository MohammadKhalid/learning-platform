import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

import { SOCKET_URL } from '../../../environments/environment';

import RTCMultiConnection from 'rtcmulticonnection';
import adapter from 'webrtc-adapter';
import io from 'socket.io-client';
import { forEach } from '@angular/router/src/utils/collection';
import 'rxjs/add/operator/map';

(<any>window).io = io;

@Injectable({
  providedIn: 'root'
})
export class RtcService {

	connection: RTCMultiConnection;
	socketConnection: any;
	socketUrl: string = SOCKET_URL;
	channel: string = 'thrive19';
	iceServers: any = {
		stun: { 
			urls: 'stun:stun.l.google.com:19302'
		},
		turn: {
			urls: 'turn:homeo@turn.bistri.com:80',
    	credential: 'homeo'
		}
	};
	connectionConfigMergeKey = ['extra'];

	constructor(
		private toastCtrl: ToastController
	) {}

	initConnection(userData: any) {
		let connection = new RTCMultiConnection();

		connection.channel = this.channel;
		connection.socketURL = this.socketUrl;

		// STUN+TURN servers
		connection.iceServers = [];
		connection.iceServers.push(this.iceServers.stun);
		connection.iceServers.push(this.iceServers.turn);

		// extra data
		connection.extra = userData;
		connection.extra.userFullName = userData.firstName + ' ' + userData.lastName;
		
		// connect socket
		connection.connectSocket();

		this.connection = connection;

		// set socket
		this.connection.getSocket((socket) => {
			this.socketConnection = socket;
		});

		console.log('CONNECTIONNNN INIT', connection);
	}

	async create(params: any = {}) {
		// if(this.connection) return this.connection;

		let connection = new RTCMultiConnection();

		// default channel
		connection.channel = this.channel;

		// socket url
		connection.socketURL = this.socketUrl;

		// STUN+TURN servers
		connection.iceServers = [];
		connection.iceServers.push(this.iceServers.stun);
		connection.iceServers.push(this.iceServers.turn);

		// default extra
		connection.extra = this.connection ? this.connection.extra : {};

		// set params
		for (const key in params) {
			if (params.hasOwnProperty(key)) {
				if(this.connectionConfigMergeKey.includes(key)) {
					connection[key] = { ...connection[key], ...params[key] };
				} else {
					connection[key] = params[key];
				}
			} else {
				connection[key] = params[key];
			}
		}

		return connection;
	}

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

	async getSocketConnection() {
		return this.socketConnection;
	}

	getConnection() {
		if(!this.connection) this.create().then((connection) => { return connection; });
		else return this.connection;
	}

	setSocketConnectionCustomEvent(eventName: string) {
		this.connection.setCustomSocketEvent(eventName);
	}

	async showToastMsg(msg: string) {
		const toast = await this.toastCtrl.create({
			message: msg,
			position: 'bottom',
			closeButtonText: 'OK',
			showCloseButton: true
		});

		toast.present();
	}

	disconnect(): void {
		this.connection.disconnect();
		console.log('RTC CONNECTION DISCONNECTED', this.connection);
	}
}