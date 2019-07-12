import { Component, OnInit, OnDestroy, Renderer2, ViewChild, ElementRef, Input } from '@angular/core';
import { NavController, ActionSheetController, AlertController, IonInput, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

import { RtcService } from '../../services/rtc/rtc.service';
import { RestApiService } from '../../services/http/rest-api.service';
import { NotificationService } from '../../services/notification/notification.service';

import * as moment from 'moment';
import { SimplePdfViewerComponent, SimpleProgressData } from 'simple-pdf-viewer';
import recordRTC from 'recordrtc';
import { async } from 'rxjs/internal/scheduler/async';

@Component({
	selector: 'conference',
	templateUrl: './conference.component.html',
	styleUrls: ['./conference.component.scss'],
})

export class ConferenceComponent implements OnInit, OnDestroy {
	@ViewChild('chatMessageUl') private myScrollContainer: ElementRef;
	@ViewChild('mobileMessageUl') private myMobileContainer: ElementRef;



	@Input('id') id: string;
	@Input('publicRoomIdentifier') publicRoomIdentifier: string = 'conference';
	@Input('user') user: any = {};

	@Input('appUrl') appUrl: string;
	@Input('apiEndPoint') apiEndPoint: string;

	@ViewChild('videosContainer') videosContainer: ElementRef;
	@ViewChild('speakerVideoForStudent') speakerVideoForStudent: ElementRef;
	@ViewChild('videosContainer_mob') videosContainer_mob: ElementRef;
	@ViewChild('participantsContainer', { read: ElementRef }) participantsContainer: ElementRef;
	@ViewChild('sharedPartOfScreenPreview') sharedPartOfScreenPreview: ElementRef;
	@ViewChild('speakerVideo') speakerVideo: ElementRef;
	@ViewChild('speakerVideo_mob') speakerVideo_mob: ElementRef;
	@ViewChild('miniSpeakerVideo') miniSpeakerVideo: ElementRef;

	@ViewChild('pdfViewer') pdfViewer: SimplePdfViewerComponent;
	@ViewChild('pdfViewer', { read: ElementRef }) pdfViewerElem: ElementRef;
	@ViewChild('pdfViewerInput') pdfViewerInput: IonInput;

	item: any = {};
	connection: any;
	socket: any;
	isChatOn: boolean = true;
	isChatOn1: boolean = true;

	pdfViewerFile: Blob;
	pdfViewerCurrentPage: number;

	panel: string = 'speaker';
	screenVar: string = "notsharescreen";
	recordScreen: boolean = true;
	panelModal: string;
	participantsCount: number = 0;
	matGroup: boolean = false;
	messages: any[] = [];
	message: string;
	interval = null
	miniVideoElem: any;

	isSpeaker: boolean;

	newMessage: boolean;
	newScreenShare: boolean;

	streams: any = {};
	localStream: any;
	recordContext: any;

	isLoading: boolean = true;
	studentMediaStream: any;
	screenSharing: any;
	studentSideCoachVisible: boolean = true;
	dummyStream: any;
	onlineUsers: any = [];
	audioPlay = new Audio();
	// getMediaStream: any;

	constructor(
		private rtcService: RtcService,
		private restApi: RestApiService,
		private notificationService: NotificationService,
		private navCtrl: NavController,
		private router: Router,
		private elementRenderer: Renderer2,
		private actionSheetCtrl: ActionSheetController,
		private alertCtrl: AlertController,
		private toastController: ToastController
	) {
		// nav data
		const navigation = this.router.getCurrentNavigation();
		if (navigation.extras && navigation.extras.state) this.id = navigation.extras.state.id;

		console.log('NAVIGATION DATA', navigation);
	}

	ngOnInit() {
		this.audioPlay.src = "./assets/message-sound/graceful.mp3";
		this.audioPlay.load();

		// rtc connection
		// this.screenShareMessage()
		this.rtcService.getConnection().then((connection) => {
			// set connection
			this.connection = connection;

			// get set socket
			this.connection.getSocket((socket) => {
				console.log('SOCKET GETTTTTTTTTTTTTTT', socket);
				this.socket = socket;

				this.loadData();
			});

		});
	}
	bottomScroll(): void {
		setTimeout(() => {
			try {
				if (this.myScrollContainer)
					this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
				if (this.myMobileContainer)
					this.myMobileContainer.nativeElement.scrollTop = this.myMobileContainer.nativeElement.scrollHeight;

			} catch (error) {

			}

		}, 50);
	}
	loadData() {
		console.log('CONNECTION', this.connection);

		// load data
		this.restApi.get(this.apiEndPoint + '/' + this.id, {}).subscribe((resp: any) => {
			if (resp.success === true) {
				this.item = resp.item;

				// status
				if (this.item.started) this.item.status = 'started';

				// participant type
				if (this.user.id === this.item.speakerId) this.isSpeaker = true;

				// validate session
				this.connection.checkPresence(this.id, (isRoomExist) => {
					if (!isRoomExist && !this.isSpeaker) {
						this.navCtrl.navigateRoot('/' + this.appUrl).then(() => {
							this.notificationService.showMsg('Room is not yet open!');
						});
					} else if (!this.isSpeaker && this.item.public !== true) {
						this.isParticipant().then((res: boolean) => {
							if (res) {
								this.initConnection();
							} else {
								this.notificationService.showMsg('You are not in participants list!').then(() => {
									this.navCtrl.navigateRoot(this.appUrl);
								});
							}
						});
					} else {
						this.initConnection();
					}
				});
			} else {
				this.navCtrl.navigateForward(this.appUrl);
			}
		});
	}
	async chromeStartStopRecord(flag: boolean) {
		if (flag) {
			switch (this.user.type) {
				case "coach":
					if (this.connection.attachStreams.length == 2) {
						let stream = this.connection.attachStreams[1];

						stream.addTrack(this.connection.attachStreams[0].getAudioTracks()[0]);
						this.recordContext = new recordRTC(stream, {
							type: 'video'
						});
						this.recordContext.startRecording();
						// this.shareScreen(false)
						// this.screenVar == "sharescreen";

						// this.screenVar = "sharescreen";
						// this.shareScreen(false);
					}
					else {
						let objBrowserScreen: any = navigator.mediaDevices;
						objBrowserScreen.getDisplayMedia({
							video: true,
						}).then(externalStream => {
							//add end event for chrome
							externalStream.addTrack(this.connection.attachStreams[0].getAudioTracks()[0]);
							this.recordContext = new recordRTC(externalStream, {
								type: 'video'
							});
							this.recordContext.startRecording();
							// externalStream.isAudio = true;
							// this.connection.attachStreams[0].isAudio = true;

							externalStream.getVideoTracks()[0].addEventListener('ended', () => {
								//for ka loop laga kar stream agr ho tou del krwani h.

								if (this.connection.attachStreams[this.connection.attachStreams.length - 1].isVideo === undefined) {
									this.screenVar = "notsharescreen";
									this.connection.attachStreams.pop();
								}
							});

							//add stream into RTC
							// this.connection.addStream(externalStream);
							// if (this.user.type == 'coach') {
							// 	// video.srcObject = null;
							// 	if (recallRecord) {
							// 		this.startStopRecord(true);
							// 	}
							// }
							// if (recallRecord) {
							// 	//do something
							// }
							// else {
							// 	this.connection.send({
							// 		type: 'screenshare',
							// 		extra: { screenShare: true, streamId: this.connection.attachStreams[0].streamid }
							// 	});
							// }

							// this.chromeScreenShare(false)
						}, error => {
							alert(error);
						});
						// this.screenVar == "sharescreen";
						// // this.screenVar = "sharescreen";
						// this.shareScreen(true);
						// return;
					}
					break;
				case "student":
					if (this.studentMediaStream) {
						// this.studentMediaStream.getTracks()[0].stop();
						this.recordContext = new recordRTC(this.studentMediaStream, {
							type: 'video',
						});
						this.recordContext.startRecording();
					}
					else {

						let objBrowserScreen: any = navigator.mediaDevices;
						await objBrowserScreen.getDisplayMedia({
							video: true
						}).then(externalStream => {
							//add end event for chrome
							this.studentMediaStream = externalStream;
							let videoTag = this.speakerVideo;
							this.connection.streamEvents.selectAll({
								remote: true
							}).forEach(function (remoteStreamEvent) {
								if (remoteStreamEvent.stream.isVideo) {
									debugger;
									console.log(videoTag.nativeElement.srcObject.getAudioTracks()[0]);
									externalStream.addTrack(videoTag.nativeElement.srcObject.getAudioTracks()[0]);
									// remoteStreamEvent.stream.getAudioTracks()[0];
									// console.log(remoteStreamEvent.stream.getVideoTracks()[0]);
								}
							});
							// console.log(this.speakerVideo.nativeElement.srcObject);
							// console.log(this.connection.getRemoteStreams());
							// this.studentMediaStream.addTrack(this.connection.getRemoteStreams().getAudioTracks()[0]); //coach stream
							externalStream.getVideoTracks()[0].addEventListener('ended', () => {
								this.recordContext.stopRecording(async () => {
									var blob = await this.recordContext.getBlob();
									recordRTC.invokeSaveAsDialog(blob);
									this.recordScreen = !this.recordScreen;
								});
								// this.connection.attachStreams.pop();
								this.studentMediaStream.getTracks()[0].stop();
								this.studentMediaStream = undefined;

							});
							this.recordContext = new recordRTC(this.studentMediaStream, {
								type: 'video',
							});
							this.recordContext.startRecording();
							//add stream into RTC
							// this.connection.addStream(externalStream);
							// this.startStopRecord(true);
						}, error => {
							alert(error);
							this.recordScreen = !this.recordScreen;
						});

					}

				// let stream = await document.querySelector('video').srcObject;
				// this.recordContext = new recordRTC(stream, {
				// 	type: 'video'
				// });
				// this.recordContext.startRecording();
				default:
					break;
			}

		}
		else {
			// if (this.user.type == "student") {
			// 	this.studentMediaStream = null;
			// }
			// coach
			// if (this.user.type== 'coach') {

			// 	// this.connection.attachStreams[this.connection.attachStreams.length - 1].getTracks().forEach(el => el.stop());

			// 	// if (this.connection.attachStreams[this.connection.attachStreams.length - 1].isVideo === undefined) {
			// 	// 	this.screenVar = "notsharescreen";
			// 	// 	this.connection.attachStreams.pop();
			// 	// }
			// }
			this.recordContext.stopRecording(async () => {
				var blob = await this.recordContext.getBlob();
				recordRTC.invokeSaveAsDialog(blob);
			});

			// student
		}
		this.recordScreen = !this.recordScreen;
	}
	async fireFoxStartStopRecord(flag: boolean) {
		if (flag) {
			switch (this.user.type) {
				case "coach":
					if (this.connection.attachStreams.length == 2) {
						let stream = await this.connection.streamEvents[this.connection.attachStreams[1].streamid].stream;
						this.recordContext = new recordRTC(stream, {
							type: 'video',
						});
						this.recordContext.startRecording();
						this.screenVar == "notshareScreen";
						this.shareScreen(false);
					}
					else {
						this.shareScreen(true);
						return;
					}
					break;
				case "student":
					let stream = await document.querySelector('video').srcObject;
					this.recordContext = new recordRTC(stream, {
						type: 'video'
					});
					this.recordContext.startRecording();
				default:
					break;
			}

		}
		else {
			this.recordContext.stopRecording(() => {
				var blob = this.recordContext.getBlob();
				recordRTC.invokeSaveAsDialog(blob);
			});
		}
		this.recordScreen = !this.recordScreen;
	}
	startStopRecord(flag: boolean) {
		if (this.connection.DetectRTC.browser.name === 'Chrome') {
			this.chromeStartStopRecord(flag);
		}
		else {
			this.fireFoxStartStopRecord(flag);
		}
	}

	chromeScreenShare(recallRecord: boolean) {
		let video = document.querySelector('video');

		if (this.screenVar == "sharescreen") {
			// if (this.connection.attachStreams.length == 1) {
			let objBrowserScreen: any = navigator.mediaDevices;
			// objBrowserScreen.addTrack(this.connection.attachStreams[0].getAudioTracks()[0]);//new functionality for audio
			objBrowserScreen.getDisplayMedia({
				video: true
			}).then(externalStream => {
				//add end event for chrome

				// externalStream.isAudio = true;
				// this.connection.attachStreams[0].isAudio = true;
				externalStream.addTrack(this.connection.attachStreams[0].getAudioTracks()[0]);//new functionality for audio
				externalStream.getVideoTracks()[0].addEventListener('ended', () => {
					//for ka loop laga kar stream agr ho tou del krwani h.

					if (this.connection.attachStreams[this.connection.attachStreams.length - 1].isVideo === undefined) {
						this.screenVar = "notsharescreen";
						this.connection.attachStreams.pop();
					}
					// this.connection.attachStreams.forEach(el => {
					// 	if (el.isvide != true) {
					// 		this.screenVar = "notsharescreen";
					// 		this.connection.attachStreams.pop();
					// 	}
					// });
					// this.screenVar = "sharescreen";
					// this.connection.attachStreams.pop();
					// this.shareScreen(false);
				});

				//add stream into RTC
				this.connection.addStream(externalStream);
				if (this.user.type == 'coach') {
					// video.srcObject = null;
					if (recallRecord) {
						this.startStopRecord(true);
					}
				}
				if (recallRecord) {
					//do something
				}
				else {
					this.connection.send({
						type: 'screenshare',
						extra: { screenShare: true, streamId: this.connection.attachStreams[0].streamid }
					});
				}

				// this.chromeScreenShare(false)
			}, error => {
				alert(error);
			});
			// } 
			// else {
			// 	this.connection.attachStreams.pop();
			// 	// video.srcObject = null;
			// 	this.chromeScreenShare(recallRecord);
			// 	// this.connection.replaceTrack(this.connection.attachStreams[1]);

			// 	// this.connection.send({
			// 	// 	type: 'screenshare',
			// 	// 	extra: { screenShare: true, streamId: this.connection.attachStreams[0].streamid }
			// 	// });
			// }
		}
		else {
			// let currentStream = this.connection.streamEvents[this.connection.attachStreams[1].streamid];
			// currentStream.getTracks().forEach(el => el.stop());

			this.connection.attachStreams.pop();
			this.connection.replaceTrack(this.connection.attachStreams[0]);
			let streamEvent = this.connection.streamEvents[this.connection.attachStreams[0].streamid];
			let mediaStreamObj = streamEvent.stream;
			video.srcObject = mediaStreamObj;

			this.connection.send({
				type: 'screenshare',
				extra: { screenShare: false, streamId: this.connection.attachStreams[0].streamid }
			});
		}
	}
	fireFoxScreenShare(recallRecord: boolean) {
		let video = this.speakerVideo.nativeElement;
		if (this.screenVar == "sharescreen") {
			this.connection.replaceTrack({
				screen: true,
				audio: true,
				oneway: true
			});
			if (this.interval != null) {
				clearInterval(this.interval)
			}
			let sameScreenInterval = setInterval(() => {
				if (this.connection.attachStreams.length == 2) {
					let streamEvent = this.connection.streamEvents[this.connection.attachStreams[0].streamid]
					let mediaStreamObj = streamEvent.stream
					video.srcObject = mediaStreamObj;
					video.play();
					clearInterval(sameScreenInterval);
				}

			}, 100);
			if (this.user.type == 'coach') {
				this.interval = setInterval(() => {
					// video.srcObject = null;
					if (this.connection.attachStreams.length == 2 && recallRecord) {
						clearInterval(this.interval);
						this.startStopRecord(true);
					}
				}, 100);
			}
		}
		else {
			clearInterval(this.interval)
			this.connection.resetTrack();
			if (this.connection.attachStreams.length == 2) {
				let streamEvent = this.connection.streamEvents[this.connection.attachStreams[0].streamid];
				let mediaStreamObj = streamEvent.stream;
				video.srcObject = mediaStreamObj;
			}
		}
	}
	// fireFoxScreenShare(recallRecord: boolean) {
	// 	let video = this.speakerVideo.nativeElement;
	// 	if (this.screenVar == "sharescreen") {
	// 		this.connection.resetScreen();
	// 		this.connection.addStream({
	// 			screen: true,
	// 			audio: true,
	// 			oneway: true,
	// 			// streamCallback: function (stream) {
	// 			// 	let streamEvent = this.connection.streamEvents[this.connection.attachStreams[0].streamid]
	// 			// 	let mediaStreamObj = streamEvent.stream
	// 			// 	video.srcObject = mediaStreamObj;
	// 			// 	video.play();
	// 			// }
	// 		});
	// 		if (this.interval != null) {
	// 			clearInterval(this.interval)
	// 		}
	// 		let sameScreenInterval = setInterval(() => {
	// 			if (this.connection.attachStreams.length == 2) {
	// 				let streamEvent = this.connection.streamEvents[this.connection.attachStreams[0].streamid]
	// 				let mediaStreamObj = streamEvent.stream
	// 				video.srcObject = mediaStreamObj;
	// 				video.play();
	// 				clearInterval(sameScreenInterval);
	// 			}

	// 		}, 100);
	// 		if (this.user.type == 'coach') {
	// 			this.interval = setInterval(() => {
	// 				// video.srcObject = null;
	// 				if (this.connection.attachStreams.length == 2 && recallRecord) {
	// 					clearInterval(this.interval);
	// 					this.startStopRecord(true);
	// 				}
	// 			}, 100);
	// 		}
	// 		this.connection.send({
	// 			type: 'screenshare',
	// 			extra: { screenShare: true, streamId: this.connection.attachStreams[0].streamid }
	// 		});
	// 	}
	// 	else {
	// 		clearInterval(this.interval);
	// 		this.connection.streamEvents.selectAll().splice(1);
	// 		// this.connection.removeStream(this.connection.attachStreams[1].streamid.replace('{', '').replace('}', ''));
	// 		this.connection.renegotiate();
	// 		// this.connection.removeStream(this.connection.attachStreams[1].streamid.replace('{','').replace('}',''));
	// 		this.connection.attachStreams.pop();
	// 		// this.connection.streamEvents.pop();
	// 		this.connection.replaceTrack(this.connection.attachStreams[0]);
	// 		// this.connection.resetTrack();
	// 		// if (this.connection.attachStreams.length == 2) {
	// 		let streamEvent = this.connection.streamEvents[this.connection.attachStreams[0].streamid];
	// 		let mediaStreamObj = streamEvent.stream;
	// 		video.srcObject = mediaStreamObj;
	// 		video.play();
	// 		// }

	// 		this.connection.send({
	// 			type: 'screenshare',
	// 			extra: { screenShare: false, streamId: this.connection.attachStreams[0].streamid }
	// 		});
	// 	}
	// }


	async shareScreen(recallRecord: boolean) {
		this.screenVar = this.screenVar == "sharescreen" ? "notsharescreen" : "sharescreen";
		if (this.connection.DetectRTC.browser.name === 'Chrome') {
			this.chromeScreenShare(recallRecord);
		}
		else {
			this.fireFoxScreenShare(recallRecord);
		}
	}

	initConnection() {
		// set connection options
		this.connection.publicRoomIdentifier = this.publicRoomIdentifier;
		this.connection.autoCloseEntireSession = false;
		this.connection.autoCreateMediaElement = false;
		this.connection.videosContainer = this.videosContainer.nativeElement;
		this.connection.videosContainer_mob = this.videosContainer_mob.nativeElement;
		this.connection.session = {
			video: true,
			data: true,
			oneway: true
		};
		this.connection.processSdp = (sdp) => {
			return sdp;
		}
		this.connection.optionalArgument = {};
		// browser codecs support
		if (this.connection.DetectRTC.browser.isSafari && Number(this.connection.DetectRTC.browser.fullVersion) <= 12.1) this.connection.codecs.video = 'H264';

		if (this.user.type == "coach") {
			this.connection.sdpConstraints = {
				mandatory: {
					OfferToReceiveAudio: true,
					OfferToReceiveVideo: false
				}
			};
		}
		else {
			this.connection.sdpConstraints = {
				mandatory: {
					OfferToReceiveAudio: true,
					OfferToReceiveVideo: false
				}
			};
		}

		// on close
		this.connection.onclose = () => {
			// reinitialize connection
			this.rtcService.initConnection();
		}

		// socket message
		// this.connection.socketMessageEvent = this.publicRoomIdentifier + '-' + this.item.id;
		this.connection.setCustomSocketEvent(this.publicRoomIdentifier);

		// set speaker flag
		if (this.isSpeaker) {
			this.user.pdfViewer = {};

			this.connection.extra.initiator = true;
			this.connection.extra.sessionStream = { video: true, audio: true };

			if (!this.user.initiatedSessions) this.user.initiatedSessions = {};
		}

		// extra session data
		if (!this.connection.extra.hasOwnProperty('sessions')) this.connection.extra.sessions = {};
		if (!this.connection.extra.sessions.hasOwnProperty(this.item.id)) this.connection.extra.sessions[this.item.id] = {};

		this.connection.extra = { ...this.connection.extra, ...this.user };
		this.connection.updateExtraData();

		this.connection.onmessage = (event) => {
			console.log('CONN ON MESSAGE', event);
			switch (event.data.type) {
				case 'screenshare':
					if (this.user.type == 'student' && event.data.extra.screenShare) {
						// alert('if fire')

						this.studentSideCoachVisible = false;
						console.log("connectioon", this.connection.streamEvents.selectAll());
						// if (this.connection.streamEvents.selectAll().length == 2) {
						// 	this.speakerVideoForStudent.nativeElement.srcObject = this.dummyStream;
						// 	// this.speakerVideoForStudent.nativeElement.srcObject = this.connection.streamEvents.selectAll()[0].stream;
						// 	this.speakerVideoForStudent.nativeElement.play();
						// }
						// else {
						this.dummyStream = this.connection.getRemoteStreams()[0];
						this.speakerVideoForStudent.nativeElement.srcObject = this.connection.getRemoteStreams()[0];
						this.speakerVideoForStudent.nativeElement.play();
						// }
						// this.connection.streamEvents.selectAll().forEach(el => {
						// 	if (el.stream.id == event.data.extra.streamId) {
						// 		this.speakerVideoForStudent.nativeElement.srcObject = el.stream;
						// 		this.speakerVideoForStudent.nativeElement.play();
						// 	}
						// 	// if (el.stream.isVideo == true && el.stream.type == "remote") {
						// 	// this.speakerVideoForStudent.nativeElement.srcObject = this.connection.streamEvents.selectAll()[0].stream;
						// 	// this.speakerVideoForStudent.nativeElement.play();
						// 	// }
						// });
						// this.speakerVideoForStudent.nativeElement.src = URL.createObjectURL(event.stream);
					}
					else {
						// alert('else fire')
						this.studentSideCoachVisible = true;
					}
					break;

				case 'chat':
					this.messages.push(event.data);
					this.bottomScroll();
					if (this.panelModal !== 'message') {
						this.newMessage = true;
						// toast message
						this.audioPlay.play();
						this.notificationService.showMsg(event.data.firstName + ' say "' + event.data.text + '"');
					}
					break;
				case 'session':
					if (event.data.status === 'started') {
						this.item.status = 'started';
						this.item.started = event.data.started;
					} else if (event.data.status === 'done') {
						this.item.status = 'done';
						this.item.status = 'close';

						this.notificationService.showMsg('Session closed!');
					}
					break;
				case 'pdfViewer':
					if (event.data.userid && event.data.userid !== this.connection.userid) return false;

					if (event.data.action === 'loadFile') {
						// switch to screen panel
						this.panel = 'screen';

						// page start
						if (event.data.pageStart) this.pdfViewerCurrentPage = event.data.pageStart;

						// load file to pdfViewer
						setTimeout(() => {
							this.pdfViewerLoadFile(event.data.file);
						});
					} else if (event.data.action === 'gotoPage') {
						this.pdfViewer.navigateToPage(event.data.number);
					} else if (event.data.action === 'stop') {
						this.pdfViewerFile = null;
						this.panel = 'speaker';
					}

					if (this.panel !== 'screen') this.newScreenShare = true;
					break;
				case 'speaking':
					this.streams[event.data.streamid].audioIconElem.setAttribute('color', event.data.value === true ? 'success' : 'light');
					break;
				case 'toast':
					this.notificationService.showMsg(event.data.message);
					break;
				case 'join':
					// this.participantsCount++
					this.onlineUsers = [];
					this.connection.getAllParticipants().forEach(el => {
						let user = this.connection.peers[el];
						this.onlineUsers.push(user.extra);
					});
					this.participantsCount = this.onlineUsers.length;
					this.connection.send({ type: 'online', users: this.onlineUsers });

					this.notificationService.showMsg(event.data.message);
					// send load to pdfViewer new participant
					if (this.pdfViewerFile) {
						if (this.isSpeaker && this.connection.extra.pdfViewer.file) {
							this.connection.send({
								type: 'pdfViewer',
								action: 'loadFile',
								pageStart: this.pdfViewerCurrentPage,
								file: this.connection.extra.pdfViewer.file
							});
						}
					}
					break;
				case 'online':
					if (this.user.type == 'student') {
						// this.onlineUsers = event.data.users.filter(el => el.id != this.user.id);
						this.onlineUsers = event.data.users;
						this.participantsCount = this.onlineUsers.length;
						// if (this.user.id != event.data.extra.id) {
						// 	// this.onlineUsers.push(user.extra);
						// 	this.onlineUsers = event.data.users;
						// 	this.participantsCount = this.onlineUsers.length;
						// }
						// this.onlineUsers = event.data.users;
						// this.participantsCount = this.onlineUsers.length;
					}
					break;
				case 'remoteStream':
					switch (event.data.action) {
						case 'muteUnmute':
							this.streamMuteUnmute(event.data.stream);
							break;

						default:
							break;
					}

					break;
				default:
					break;
			}
		};

		this.connection.onmute = () => {
			// console.log('ON-MUTE', e);
		};

		this.connection.onunmute = () => {
			// console.log('ON-UNMUTE', e);
			// e.stream[e.unmuteType + 'Muted'] = false;
		};

		this.connection.onstream = (event) => {
			// if (this.user.type == 'student') {

			// 	console.log("connectioon", this.connection.streamEvents.selectAll());
			// 	this.connection.streamEvents.selectAll().forEach(el => {
			// 		if (el.stream.isVideo == true && el.stream.type == "remote") {
			// 			this.speakerVideoForStudent.nativeElement.srcObject = el.stream;
			// 			this.speakerVideoForStudent.nativeElement.play();
			// 		}
			// 	});
			// 	// this.speakerVideoForStudent.nativeElement.src = URL.createObjectURL(event.stream);

			// }

			if (this.streams[event.streamid]) {
				console.log('STREAM EXISTSSSS');
				return;
			}

			// add stream
			this.streams[event.streamid] = event.stream;

			// video
			let video = event.extra.initiator ? this.speakerVideo.nativeElement : this.elementRenderer.createElement('video');
			let video_mob = event.extra.initiator ? this.speakerVideo_mob.nativeElement : this.elementRenderer.createElement('video');
			if (event.type === 'local') {
				video.volume = 0;
				video_mob.volume = 0;
				try {
					video.setAttributeNode(document.createAttribute('muted'));
					video_mob.setAttributeNode(document.createAttribute('muted'));
				} catch (e) {
					video.setAttribute('muted', true);
					video_mob.setAttribute('muted', true);
				}

				// speech event
				// if(!event.extra.initiator) this.captureUserSpeechEvents(event.stream);

				// local stream
				if (event.extra.sessions[this.item.id].hasOwnProperty('localStream')) {
					// mute
					if (this.connection.extra.sessions[this.item.id].localStream.video.muted) {
						event.stream.mute('video');
						this.localStream.video.muted = true;
					}
					if (this.connection.extra.sessions[this.item.id].localStream.audio.muted) {
						event.stream.mute('audio');
						this.localStream.audio.muted = true;
					}
				} else {
					this.connection.extra.sessions[this.item.id].localStream = {
						id: event.streamid,
						audio: { muted: false, control: true },
						video: { muted: false, control: true }
					}
					this.connection.updateExtraData();

					this.localStream = this.connection.extra.sessions[this.item.id].localStream;
				}
			}
			video.srcObject = event.stream;
			video_mob.srcObject = event.stream;




			// setup participant video html
			if (!event.extra.initiator) {
				console.log('EVENT INITIATORRR');

				// set attributes
				try {
					video.setAttributeNode(document.createAttribute('autoplay'));
					video.setAttributeNode(document.createAttribute('playsinline'));

					video_mob.setAttributeNode(document.createAttribute('autoplay'));
					video_mob.setAttributeNode(document.createAttribute('playsinline'));
				} catch (e) {
					video.setAttribute('autoplay', true);
					video.setAttribute('playsinline', true);
					video_mob.setAttribute('autoplay', true);
					video_mob.setAttribute('playsinline', true);
				}

				// video container
				let videoContainer = this.elementRenderer.createElement('div');

				this.elementRenderer.addClass(videoContainer, 'participant-video-container');
				this.elementRenderer.addClass(video, 'participant-video');

				videoContainer.appendChild(video);

				// video label mic icon
				let videoLabelElem = this.elementRenderer.createElement('ion-chip');
				videoLabelElem.outline = true;
				videoLabelElem.color = 'light';

				let videoLabelIconElem = this.elementRenderer.createElement('ion-icon');
				videoLabelIconElem.name = 'mic';
				videoLabelIconElem.size = 'small';
				videoLabelIconElem.color = 'light';
				this.streams[event.streamid].audioIconElem = videoLabelIconElem;

				videoLabelElem.append(videoLabelIconElem);

				let videoLabelLabelElem = this.elementRenderer.createElement('ion-label');
				videoLabelLabelElem.color = 'light';
				videoLabelLabelElem.innerHTML = '<small>' + event.extra.firstName + ' ' + event.extra.lastName + '</small>';

				videoLabelElem.append(videoLabelLabelElem);

				let videoLabelContainer = this.elementRenderer.createElement('div');
				this.elementRenderer.addClass(videoLabelContainer, 'participant-video-label-container');

				// videoLabelContainer.innerHTML = videoLabelHtml;
				videoLabelContainer.append(videoLabelElem);
				videoContainer.appendChild(videoLabelContainer);

				// elem container
				let elemContainer = this.elementRenderer.createElement('div');
				elemContainer.id = 'participant-video-container-' + event.streamid;

				this.elementRenderer.setAttribute(elemContainer, 'data-userid', event.userid);
				this.elementRenderer.setAttribute(elemContainer, 'participant-streamid', event.streamid);
				this.elementRenderer.setAttribute(elemContainer, 'size', '12');

				elemContainer.appendChild(videoContainer);

				// append to connection container
				this.participantsContainer.nativeElement.appendChild(elemContainer);

				// count participant
				// this.participantsCount++;

				// alert(this.participantsCount)
			}

			setTimeout(() => {
				video.play();
				video_mob.play();
			}, 5000);

			// if(event.type === 'local') {
			// 	this.connection.socket.on('disconnect', () => {
			// 		if(!this.connection.getAllParticipants().length) {
			// 			location.reload();
			// 		}
			// 	});
			// }
		};

		this.connection.onstreamended = (event) => {
			console.log('STREAM ENDED', event);

			// remove media element
			// this.participantElemExists('#' + event.streamid).then((elem: any) => {
			// 	if(elem) elem.remove();
			// });

			// remove stream
			if (this.streams[event.streamid]) {
				delete this.streams[event.streamid];

				console.log('STREAM DELETED');
			} else {
				console.log('NO STREAM DELETED');
			}
		}

		this.connection.onleave = (event) => {
			console.log('USER LEAVE', event);

			// backup extra data
			// this.connection.peersBackup[event.userid];

			// remove participant video element
			if (event.extra.initiator) {
				// this.speakerVideo.nativeElement.srcObject = null;
			}
			else {
				if (this.onlineUsers.length > 0) {
					this.onlineUsers = this.onlineUsers;
					this.participantsCount = this.onlineUsers.length;
					this.connection.send({ type: 'online', users: this.onlineUsers });
				}
				let participantsContainerElem = this.participantsContainer.nativeElement.querySelectorAll('[data-userid="' + event.userid + '"]')
				if (participantsContainerElem) {
					console.log('USER LEAVE ELEMS', participantsContainerElem);

					participantsContainerElem.forEach((elem) => {
						elem.remove();
					});
				}

				// count participant
				// this.participantsCount--;
				// alert(this.participantsCount)
			}
		};

		this.connection.onMediaError = (e) => {
			console.log('MEDIA ERROR', e);

			if (e.message === 'Concurrent mic process limit.') {
				if (this.connection.DetectRTC.audioInputDevices.length <= 1) {
					console.log('Please select external microphone. Check github issue number 483.');
					return;
				}

				let secondaryMic = this.connection.DetectRTC.audioInputDevices[1].deviceId;
				this.connection.mediaConstraints.audio = {
					deviceId: secondaryMic
				};

				// reconnect
				this.openJoin();
			}
		};

		this.connection.onEntireSessionClosed = (event: any) => {
			console.info('Entire session is closed: ', event.sessionid, event.extra);
		};

		// enter room
		this.openJoin();
	}

	openJoin() {
		// join
		if (this.isSpeaker) {
			this.connection.openOrJoin(this.item.id, (isRoomCreated, roomid) => {
				// if(isRoomCreated) {
				// send message to public room
				this.socket.emit(this.publicRoomIdentifier, {
					type: 'join',
					speaker: true,
					roomid: roomid
				});

				setTimeout(() => {
					// send message to session
					this.connection.send({
						type: 'join',
						message: 'Speaker is online!'
					});
				}, 5000);
				// show controls
				this.isLoading = false;
				// }
			});

			// save initiated session
			this.user.initiatedSessions[this.item.id] = true;
		} else {
			this.connection.join(this.item.id, (isJoined, roomid) => {
				if (isJoined) {
					// send message to public room
					this.socket.emit(this.publicRoomIdentifier, {
						type: 'join',
						speaker: false,
						roomid: roomid
					});

					setTimeout(() => {
						// send message to session
						this.connection.send({
							type: 'join',
							message: this.connection.extra.firstName + ' ' + this.connection.extra.lastName + ' joined!'
						});

					}, 5000);
					// this.participantsCount++

					// show controls
					this.isLoading = false;
				}
			});
		}
	}

	captureUserSpeechEvents(stream: MediaStream) {
		// const options = {};
		// let speechEvents = hark(stream, options);

		// speechEvents.on('speaking', () => {
		// 	const participants = this.connection.getAllParticipants();

		// 	if (participants && participants.length > 0) {
		// 		this.connection.send({
		// 			type: 'speaking',
		// 			streamid: stream.id,
		// 			value: true
		// 		});
		// 	}

		// 	// local
		// 	this.streams[stream.id].audioIconElem.setAttribute('color', 'success');
		// });

		// speechEvents.on('stopped_speaking', () => {
		// 	const participants = this.connection.getAllParticipants();

		// 	if (participants && participants.length > 0) {
		// 		this.connection.send({
		// 			type: 'speaking',
		// 			streamid: stream.id,
		// 			value: false
		// 		});
		// 	}

		// 	// local
		// 	this.streams[stream.id].audioIconElem.setAttribute('color', 'light');
		// });
	}

	pdfViewerStopShare() {
		this.alertCtrl.create({
			header: 'Stop Slideshow Sharing',
			message: 'Are you sure you want to stop the slide show presentation?',
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
					cssClass: 'secondary',
					handler: () => { }
				},
				{
					text: 'Yes',
					handler: () => {
						this.panel = 'speaker';
						this.pdfViewerFile = null;

						this.pdfViewer.src = null;

						// stop slide show
						this.connection.send({
							type: 'pdfViewer',
							action: 'stop'
						});
					}
				}
			]
		}).then((alert) => {
			alert.present();
		});
	}

	pdfViewerUpload() {
		this.pdfViewerInput.getInputElement().then((fileInputEl: HTMLInputElement) => {
			fileInputEl.click();
		});
	}

	pdfViewerInputUpload(files: FileList) {
		const uploadedFile = files.item(0);
		const fileReader: any = new FileReader();

		fileReader.onload = () => {
			const fileReaderResult = fileReader.result;

			// load to pdfViewer
			this.pdfViewerLoadFile(fileReaderResult);

			// update connection extra data
			this.connection.extra.pdfViewer = {
				file: fileReaderResult,
				currentPage: 1
			};
			this.connection.updateExtraData();

			// send load to pdfViewer participants
			this.connection.send({
				type: 'pdfViewer',
				action: 'loadFile',
				file: fileReaderResult
			});
		};
		fileReader.readAsDataURL(uploadedFile);
	}

	pdfViewerProgress(event: SimpleProgressData) {
		console.log('PDF VIEWER PROGRESS', event);
	}

	pdfViewerError(event: any) {
		console.log('PDF VIEWER ERROR', event);
	}

	pdfViewerLoadFile(file: any) {
		this.pdfViewerFile = file;
		this.pdfViewer.openDocument(file);
	}

	pdfViewerLoaded() {
		console.log('PDF VIEWER LOADED', this.pdfViewer);

		// go to page
		if (this.pdfViewerCurrentPage) this.pdfViewer.navigateToPage(this.pdfViewerCurrentPage);

		// fit to screen
		this.pdfViewer.zoomPageWidth();

		// scroll to top
		setTimeout(() => {
			const pdfViewerHTMLElem = this.pdfViewerElem.nativeElement.firstChild;
			pdfViewerHTMLElem.scrollTop = 0;
		});
	}

	pdfViewerAction(action: string) {
		this.pdfViewer[action]();

		setTimeout(() => {
			const pdfViewerPage = this.pdfViewer.getCurrentPage();

			if (this.pdfViewerCurrentPage !== pdfViewerPage) {
				this.connection.send({
					type: 'pdfViewer',
					action: 'gotoPage',
					number: pdfViewerPage
				});

				// update page
				this.pdfViewerCurrentPage = pdfViewerPage;

				// update connection extra
				this.connection.extra.pdfViewer.currentPage = this.pdfViewerCurrentPage;
				this.connection.updateExtraData();
			}
		});
	}

	async participantElemExists(selector) {
		try {
			return this.participantsContainer.nativeElement.querySelector(selector);
		} catch (error) {
			return null;
		}
	}

	startSession() {
		let now = new Date().toISOString();

		this.item.started = this.beautifyDate(now, 'MMM. DD, YYYY h:mm a');

		this.restApi.put(this.apiEndPoint + '/start/' + this.item.id, { dateStart: this.item.started }).subscribe((res: any) => {
			if (res.success === true) {
				// message public room list
				this.connection.socket.emit(this.publicRoomIdentifier, {
					type: 'opened',
					started: this.item.started,
					roomid: this.connection.sessionid
				});

				// message session
				this.connection.send({
					type: 'session',
					status: 'started',
					started: this.item.started
				});

				this.item.status = 'started';
			} else {
				this.notificationService.showMsg(res.error);
			}
		});

		// this.notificationService.showMsg('Deleting...', 0).then((toast: any) => {
		// 	this.restApi.delete(this.urlEndPoint + 's/' + this.item.id).subscribe((res: any) => {
		// 		this.notificationService.toast.dismiss();

		// 		if(res.success === true) {
		// 			this.notificationService.showMsg('Live Group Training ' + this.item.title + ' has been deleted!').then(() => {
		// 				this.navCtrl.navigateRoot('/' + this.urlEndPoint);
		// 			});
		// 		} else {
		// 			this.notificationService.showMsg(res.error);
		// 		}
		// 	});
		// });
	}

	streamMuteUnmute(type: string = 'both') {
		// prevent mute/unmute from participants
		// this.connection.setDefaultEventsForMediaElement = false;

		let localStream = this.connection.attachStreams[0];
		let muted: boolean;

		console.log('localStream ', localStream);
		console.log('Stream TYPE ', type);

		if (this.connection.extra.sessions[this.item.id].localStream[type].muted) {
			localStream.unmute(type);
			muted = false;
		} else {
			localStream.mute(type);
			muted = true;
		}

		this.connection.extra.sessions[this.item.id].localStream[type].muted = muted;
		this.connection.updateExtraData();
	}

	presentParticipantSetting() {
		if (!this.isParticipant) return false;

		this.alertCtrl.create({
			header: 'On / Off',
			subHeader: 'Participants Camera',
			inputs: [
				{
					name: 'video',
					type: 'checkbox',
					label: 'Video',
					value: 'video',
					checked: this.connection.extra.sessionStream.video
				},

				{
					name: 'audio',
					type: 'checkbox',
					label: 'Audio',
					value: 'audio',
					checked: this.connection.extra.sessionStream.audio
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
					handler: (streamTypes) => {
						console.log('PARTCIPANT CAMERA', streamTypes);

						const participants = this.connection.getAllParticipants();
						const streamTypes_ = ['video', 'audio'];

						streamTypes_.forEach((type) => {
							if (participants.length > 0 && this.connection.extra.sessionStream[type] !== streamTypes.includes(type)) {
								// send participants to turn off/on their stream
								this.connection.send({
									type: 'remoteStream',
									action: 'muteUnmute',
									stream: type
								});
							}

							this.connection.extra.sessionStream[type] = streamTypes.includes(type);
							this.connection.updateExtraData();
						});
					}
				}
			]
		}).then((alert) => {
			alert.present();
		});
	}

	endSession() {
		this.notificationService.showMsg('Closing...', 0).then((toast: any) => {
			this.restApi.put(this.apiEndPoint + '/close/' + this.item.id, {}).subscribe((res: any) => {
				this.notificationService.toast.dismiss();

				if (res.success === true) {
					// update item
					this.item = res.item;

					this.connection.send({
						type: 'session',
						status: 'done'
					});

					this.alertCtrl.create({
						header: 'Session Closed',
						message: this.item.title + ' has been closed!',
						buttons: [
							{
								text: 'OK',
								handler: () => {
									this.leaveSession();
								}
							}
						]
					}).then((alert) => {
						alert.present();
					});
				} else {
					this.notificationService.showMsg(res.error);
				}
			});
		});
	}

	leaveSession() {
		this.navCtrl.navigateRoot('/' + this.appUrl);
	}

	ngOnDestroy() {
		console.log('VIEW WILL UNLOAD', this.connection);
		console.log('VIEW WILL UNLOAD SESSION', this.item.id);

		if (this.socket) {
			// send message to public room
			this.socket.emit(this.publicRoomIdentifier, {
				type: 'leave',
				status: this.item.status,
				speaker: this.isSpeaker,
				roomid: this.connection.sessionid
			});

			// if(this.status !== 'started') this.disconnectConnection();
			if (this.connection) this.disconnectConnection();
		}
	}

	disconnectConnection() {
		console.log('LEAVING PAGE', this.connection.sessionid);

		// send message to session
		const leaveMsg: string = this.connection.extra.initiator ? 'Speaker left!' : this.connection.extra.firstName + ' ' + this.connection.extra.lastName + ' left!';
		this.connection.send({
			type: 'toast',
			message: leaveMsg,
			isStudent: this.connection.extra.initiator ? false : true
		});

		this.connection.getAllParticipants().forEach((participantId) => {
			// this.connection.multiPeersHandler.onNegotiationNeeded({
			// 	userLeft: true
			// }, participantId);

			// if (this.connection.peers[participantId] && this.connection.peers[participantId].peer) {
			// 	this.connection.peers[participantId].peer.close();
			// }

			// delete this.connection.peers[participantId];

			this.connection.disconnectWith(participantId);
		});

		// stop all local cameras
		this.connection.attachStreams.forEach((localStream) => {
			localStream.stop();
		});

		setTimeout(() => {
			// reinitialize connection
			this.rtcService.initConnection();

			// close session
			this.connection.closeSocket();
		}, 3000);
	}

	showPanel(name: string) {
		// activate panel
		this.panel = this.panel === name ? 'speaker' : name;

		switch (name) {
			case 'screen':
				this.newScreenShare = false;

				// for video picture to picture mode
				// let video = this.miniVideoElem;

				// try {
				// 	video.requestPictureInPicture();
				// } catch (error) {
				// 	video.webkitSetPresentationMode(video.webkitPresentationMode === "picture-in-picture" ? "inline" : "picture-in-picture");	
				// }		
				break;
			default:
				break;
		}
	}

	showPanelModal(name: string) {
		// this.panelModal = this.panelModal === name ? null : name;
		this.matGroup = !this.matGroup
		switch (name) {
			case 'message':
				this.newMessage = false;
				break;
			default:
				break;
		}
	}

	sendMessage() {
		if (!this.message) return;
		this.isChatOn = true;
		this.isChatOn1 = true;
		const newMessage = {
			type: 'chat',
			text: this.message,
			firstName: this.user.firstName,
			lastName: this.user.lastName,
			userType: this.user.type,
			isActive: false,
			date: moment().format('HH:mm a')

		};

		// send message
		this.connection.send(newMessage);
		newMessage.isActive = true;
		this.messages.push(newMessage);

		this.bottomScroll();
		// clear textbox
		this.message = '';
	}

	presentPageAction() {
		this.actionSheetCtrl.create({
			header: this.item.title,
			buttons: [
				{
					text: 'Edit',
					icon: 'create',
					handler: () => {
						this.navCtrl.navigateRoot('/' + this.appUrl + '/edit/1');
					}
				},
				{
					text: 'Delete',
					role: 'destructive',
					icon: 'trash',
					handler: () => {
						this.confirmDelete();
					}
				},
				{
					text: 'Cancel',
					icon: 'close',
					role: 'cancel',
					handler: () => { }
				}
			]
		}).then((action) => {
			action.present();
		});
	}

	confirmDelete() {
		this.alertCtrl.create({
			header: 'Delete Confirmation',
			message: 'Are you sure you want to delete this Live Group Training "' + this.item.title + '"?',
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
					cssClass: 'secondary',
					handler: () => { }
				},
				{
					text: 'Yes',
					handler: () => {
						this.notificationService.showMsg('Deleting...', 0).then((toast: any) => {
							this.restApi.delete(this.apiEndPoint + '/' + this.item.id).subscribe((res: any) => {
								this.notificationService.toast.dismiss();

								if (res.success === true) {
									this.notificationService.showMsg('Live Group Training ' + this.item.title + ' has been deleted!').then(() => {
										this.navCtrl.navigateRoot('/' + this.appUrl);
									});
								} else {
									this.notificationService.showMsg(res.error);
								}
							});
						});
					}
				}
			]
		}).then((alert) => {
			alert.present();
		});
	}

	presentConfirmStart() {
		this.alertCtrl.create({
			header: 'Confirmation',
			message: 'Are you sure you want to start this Live Group Training?',
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
					cssClass: 'secondary',
					handler: () => { }
				},
				{
					text: 'Yes',
					handler: () => {
						this.startSession();
					}
				}
			]
		}).then((alert) => {
			alert.present();
		});
	}

	presentConfirmStop() {
		this.alertCtrl.create({
			header: 'Confirmation',
			message: 'Are you sure you want to close and done this Live Group Training?',
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
					cssClass: 'secondary',
					handler: () => { }
				},
				{
					text: 'Yes',
					handler: () => {
						this.endSession();
					}
				}
			]
		}).then((alert) => {
			alert.present();
		});
	}

	presentConfirmLeave() {
		if (this.item.status !== 'started') {
			this.leaveSession();
		} else {
			this.alertCtrl.create({
				header: 'Confirmation',
				message: 'Are you sure you want to leave on this Live Group Training?',
				buttons: [
					{
						text: 'Cancel',
						role: 'cancel',
						cssClass: 'secondary',
						handler: () => { }
					},
					{
						text: 'Yes',
						handler: () => {
							this.leaveSession();
						}
					}
				]
			}).then((alert) => {
				alert.present();
			});
		}
	}

	beautifyDate(_date: string, _format: string = 'MMMM D, YYYY') {
		return moment(_date).format(_format);
	}

	async isParticipant() {
		for (let i = this.item.participants.length - 1; i >= 0; i--) {
			if (this.item.participants[i].id == this.user.id) return true;
		}

		return false;
	}

	async screenShareMessage() {
		this.screenSharing = await this.toastController.create({
			message: 'Screen Sharing',
			position: 'top',
			color: 'danger',
			cssClass: 'toast-screen-share'
		});
		this.screenSharing.present();
	}
}
