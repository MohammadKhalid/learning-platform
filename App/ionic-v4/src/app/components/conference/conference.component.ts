import { Component, OnInit, Renderer2, ViewChild, ElementRef, Input } from '@angular/core';
import { NavController, ActionSheetController, AlertController, IonInput } from '@ionic/angular';
import { Router } from '@angular/router';

import { RtcService } from '../../services/rtc/rtc.service';
import { RestApiService } from '../../services/http/rest-api.service';

import * as moment from 'moment';
import { SimplePdfViewerComponent, SimpleProgressData } from 'simple-pdf-viewer';

import hark from 'hark';

@Component({
    selector: 'conference',
    templateUrl: './conference.component.html',
    styleUrls: ['./conference.component.scss'],
})
export class ConferenceComponent implements OnInit {

    @Input('id') id: string;
    @Input('publicRoomIdentifier') publicRoomIdentifier: string;
    @Input('user') user: any = {};
    
    @Input('appUrl') appUrl: string;
    @Input('apiEndPoint') apiEndPoint: string;

	@ViewChild('videosContainer') videosContainer: ElementRef;
	@ViewChild('participantsContainer', { read: ElementRef }) participantsContainer: ElementRef;
	@ViewChild('sharedPartOfScreenPreview') sharedPartOfScreenPreview: ElementRef;
	@ViewChild('speakerVideo') speakerVideo: ElementRef;
	@ViewChild('miniSpeakerVideo') miniSpeakerVideo: ElementRef;

	@ViewChild('pdfViewer') pdfViewer: SimplePdfViewerComponent;
	@ViewChild('pdfViewer', { read: ElementRef }) pdfViewerElem: ElementRef;
	@ViewChild('pdfViewerInput') pdfViewerInput: IonInput;

    item: any = {};
	connection: any;
	socket: any;

	pdfViewerFile: Blob;
	pdfViewerCurrentPage: number;

	panel: string = 'speaker';
	panelModal: string;
	participantsCount: number = 0;
	
	messages: any[] = [];
	message: string;

	miniVideoElem: any;

	isSpeaker: boolean;

	newMessage: boolean;
	newScreenShare: boolean;

	streams: any = {};
	localStream: any;

	constructor(
		private rtcService: RtcService,
		private restApi: RestApiService,
		private navCtrl: NavController,
        private router: Router,
        private elementRenderer: Renderer2,
		private actionSheetCtrl: ActionSheetController,
		private alertCtrl: AlertController
	) {
		// nav data
		const navigation = this.router.getCurrentNavigation();
		if(navigation.extras && navigation.extras.state) this.id = navigation.extras.state.id;

		console.log('NAVIGATION DATA', navigation);
	}

	ngOnInit() {
		// rtc connection
		this.rtcService.createConnection().then((connection) => {
			// connect and set socket
			connection.connectSocket((socket) => {
				this.socket = socket;
			});

			// set connection
			this.connection = connection;

			console.log('CONNECTION', this.connection);

			// load data
			this.restApi.get(this.apiEndPoint + '/' + this.id, {}).then((resp: any) => {
				if(resp.success === true) { 
					this.item = resp.item;
	
					// status
					if(this.item.started) this.item.status = 'started';
					
					// participant type
					if(this.user.id === this.item.speakerId) this.isSpeaker = true;

					// validate session
					this.connection.checkPresence(this.id, (isRoomExist) => {
						if(!isRoomExist && !this.isSpeaker) {
							this.navCtrl.navigateRoot('/' + this.appUrl).then(() => {
								this.restApi.showMsg('Room is not yet open!');
							});
						} else if(!this.isSpeaker && this.item.public !== true) {
							this.isParticipant().then((res: boolean) => {
								if(res) {
									this.initConnection();
								} else {
									this.restApi.showMsg('You are not in participants list!').then(() => {
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
		});
	}

	initConnection() {
		// set connection options
		this.connection.publicRoomIdentifier = this.publicRoomIdentifier;
		this.connection.autoCloseEntireSession = false;
		this.connection.videosContainer = this.videosContainer.nativeElement;
		
		// set speaker flag
		if(this.isSpeaker) {
			this.user.pdfViewer = {};

			this.connection.extra.initiator = true;
			this.connection.extra.sessionStream = { video: true, audio: true };

			if(!this.user.initiatedSessions) this.user.initiatedSessions = {};
		}

		this.connection.setCustomSocketEvent(this.publicRoomIdentifier);
		this.connection.autoCreateMediaElement = false;

		this.connection.session = { 
			audio: true,
			video: true,
			data: true
		};

		this.connection.sdpConstraints = {
			mandatory: {
				OfferToReceiveAudio: true,
				OfferToReceiveVideo: true
			}
		};

		// extra session data
		if(!this.connection.extra.hasOwnProperty('sessions')) this.connection.extra.sessions = {};
		if(!this.connection.extra.sessions.hasOwnProperty(this.item.id)) this.connection.extra.sessions[this.item.id] = {};

		this.connection.extra = { ...this.connection.extra, ...this.user };
		this.connection.updateExtraData();

		this.connection.onmessage = (event) => {
			switch (event.data.type) {
				case 'chat':
					this.messages.push(event.data);

					if(this.panelModal !== 'message') {
						this.newMessage = true;

						// toast message
						this.restApi.showMsg(event.data.firstName + ' say "' + event.data.text + '"');
					}
					break;
				case 'session':
					if(event.data.status === 'started') {
						this.item.status = 'started';
						this.item.started = event.data.started;
					} else if(event.data.status === 'done') {
						this.item.status = 'done';
						this.item.status = 'close';

						this.restApi.showMsg('Session closed!');
					}
					break;
				case 'pdfViewer':
					if(event.data.userid && event.data.userid !== this.connection.userid) return false;

					if(event.data.action === 'loadFile') {
						// switch to screen panel
						this.panel = 'screen';

						// page start
						if(event.data.pageStart) this.pdfViewerCurrentPage = event.data.pageStart;

						// load file to pdfViewer
						setTimeout(() => {
							this.pdfViewerLoadFile(event.data.file);
						});
					} else if(event.data.action === 'gotoPage') {
						this.pdfViewer.navigateToPage(event.data.number);
					} else if(event.data.action === 'stop') {
						this.pdfViewerFile = null;
						this.panel = 'speaker';
					}

					if(this.panel !== 'screen') this.newScreenShare = true;
					break;
				case 'speaking':
					this.streams[event.data.streamid].audioIconElem.setAttribute('color', event.data.value === true ? 'success' : 'light');
					break;
				case 'toast':
					this.restApi.showMsg(event.data.message);
					break;
				case 'join':
					this.restApi.showMsg(event.data.message);

					// send load to pdfViewer new participant
					if(this.pdfViewerFile) {
						if(this.isSpeaker && this.connection.extra.pdfViewer.file) {
							this.connection.send({
								type: 'pdfViewer',
								action: 'loadFile',
								pageStart: this.pdfViewerCurrentPage,
								file: this.connection.extra.pdfViewer.file
							});
						}
					}
					break;
				case 'remoteStream':
					// if(event.data.all) {
					// 	this.streamMuteUnmute(event.data.action);
					// } else if(event.data.id) {
					// 	// this.participantStreamOnOff(event.data.id, event.data.action);
					// }

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

		this.connection.onmute = (e: any) => {
			console.log('ON-MUTE', e);
			};

		this.connection.onunmute = (e: any) => {
			console.log('ON-UNMUTE', e);
			// e.stream[e.unmuteType + 'Muted'] = false;
			};
			
		this.connection.onstream = (event) => {
			console.log('ON STREAM EVENT ', event);

			// remove duplicate elem
			// let participantsContainerElem = this.participantsContainer.nativeElement.querySelectorAll('[participant-streamid="' + event.streamid + '"]')
			// console.log('ON STREAM ELEMS', participantsContainerElem);

			// if(participantsContainerElem && participantsContainerElem.length > 0) {
			// 		participantsContainerElem[0].remove();
			// }

			// if(participantsContainerElem) {
			// 	for (let index = 0; index < participantsContainerElem.length; index++) {
			// 		participantsContainerElem[index].remove();
			// 	}
			// }

			// skip
			if(this.streams[event.streamid]) return;

			// add stream
			this.streams[event.streamid] = event.stream;

			// video
			let video = event.extra.initiator ? this.speakerVideo.nativeElement : this.elementRenderer.createElement('video');

			// video.playsinline = true;
			// video.autoplay = true;

			if(event.type === 'local') {
				video.volume = 0;

				try {
          video.setAttributeNode(document.createAttribute('muted'));
				} catch (e) {
						video.setAttribute('muted', 'true');
				}
			
				// video.muted = true;
				// video.setAttribute('muted', '');

				// speech event
				if(!event.extra.initiator) this.captureUserSpeechEvents(event.stream);

				// local stream
				if(event.extra.sessions[this.item.id].hasOwnProperty('localStream')) {
					// mute
					if(this.connection.extra.sessions[this.item.id].localStream.video.muted) {
						event.stream.mute('video');
						this.localStream.video.muted = true;
					}
					if(this.connection.extra.sessions[this.item.id].localStream.audio.muted) {
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

			// setup participant video html
			if(!event.extra.initiator) {
				console.log('EVENT INITIATORRR');

				// set attributes
				// video.setAttribute('autoplay', '');
				video.setAttribute('playsinline', '');

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
				this.participantsCount++;
			}

			setTimeout(() => {
				video.play();
			}, 5000);
		};
		
		this.connection.onstreamended = (event) => {
			console.log('STREAM ENDED', event);

			// remove media element
			this.participantElemExists('#' + event.stream.id).then((elem: any) => {
				if(elem) elem.remove();
			});

			if(!event.extra.speaker) {
				// count participant
				this.participantsCount--;
			}
		}

		this.connection.onleave = (event) => {
			console.log('USER LEAVE', event);

			// backup extra data
			this.connection.peersBackup[event.userid];

			// notify
			this.restApi.showMsg(event.extra.firstName + ' ' + event.extra.lastName + ' left!');

			// remove participant video element
			if(!event.extra.speaker) {
				let participantsContainerElem = this.participantsContainer.nativeElement.querySelectorAll('[data-userid="' + event.userid + '"]')
				if(participantsContainerElem) {
					console.log('USER LEAVE ELEMS', participantsContainerElem);

					participantsContainerElem.forEach((elem) => {
						elem.remove();
					});
				}
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
		
				this.connection.join(this.connection.sessionid);
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
		if(this.isSpeaker) {
			this.connection.openOrJoin(this.item.id, (isRoomCreated, roomid) => {
				if(isRoomCreated) {
					setTimeout(() => {
						// send message to session
						this.connection.send({
							type: 'join',
							message: 'Speaker is online!'
						});

						// send message to public room
						this.socket.emit(this.publicRoomIdentifier, {
							type: 'join',
							speaker: true,
							roomid: roomid
						});
					}, 3000);
				}
			});

			// save initiated session
			this.user.initiatedSessions[this.item.id] = true;
		} else {
			this.connection.join(this.item.id, (isJoined, roomid) => {
				if(isJoined) {
					setTimeout(() => {
						// send message to session
						this.connection.send({
							type: 'join',
							message: this.connection.extra.firstName + ' ' + this.connection.extra.lastName + ' joined!'
						});

						// send message to public room
						this.socket.emit(this.publicRoomIdentifier, {
							type: 'join',
							speaker: false,
							roomid: roomid
						});
					}, 3000);
				}
			});
		}
	}

	captureUserSpeechEvents(stream: MediaStream) {
		const options = {};
		let speechEvents = hark(stream, options);

		speechEvents.on('speaking', () => {
			const participants = this.connection.getAllParticipants();

			if (participants && participants.length > 0) {
				this.connection.send({
					type: 'speaking',
					streamid: stream.id,
					value: true
				});
			}

			// local
			this.streams[stream.id].audioIconElem.setAttribute('color', 'success');
		});

		speechEvents.on('stopped_speaking', () => {
			const participants = this.connection.getAllParticipants();

			if (participants && participants.length > 0) {
				this.connection.send({
					type: 'speaking',
					streamid: stream.id,
					value: false
				});
			}
		
			// local
			this.streams[stream.id].audioIconElem.setAttribute('color', 'light');
		});
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
					handler: () => {}
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
		if(this.pdfViewerCurrentPage) this.pdfViewer.navigateToPage(this.pdfViewerCurrentPage);

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

			if(this.pdfViewerCurrentPage !== pdfViewerPage) {
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

		this.restApi.put(this.apiEndPoint + '/start/' + this.item.id, { dateStart: this.item.started }).then((res: any) => {
			if(res.success === true) {
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
				this.restApi.showMsg(res.error);
			}
		});

		// this.restApi.showMsg('Deleting...', 0).then((toast: any) => {
		// 	this.restApi.delete(this.urlEndPoint + 's/' + this.item.id).then((res: any) => {
		// 		this.restApi.toast.dismiss();

		// 		if(res.success === true) {
		// 			this.restApi.showMsg('Live Group Training ' + this.item.title + ' has been deleted!').then(() => {
		// 				this.navCtrl.navigateRoot('/' + this.urlEndPoint);
		// 			});
		// 		} else {
		// 			this.restApi.showMsg(res.error);
		// 		}
		// 	});
		// });
	}

	streamMuteUnmute(type: string = 'both') {
		// prevent mute/unmute from participants
		// connection.setDefaultEventsForMediaElement = false;

		let localStream = this.connection.attachStreams[0];
		let muted: boolean;

		console.log('localStream ', localStream);
		console.log('Stream TYPE ', type);

		if(this.connection.extra.sessions[this.item.id].localStream[type].muted) {
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
		if(!this.isParticipant) return false;

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
				handler: () => {}
			  }, {
				text: 'OK',
				handler: (streamTypes) => {
					console.log('PARTCIPANT CAMERA', streamTypes);

					const participants = this.connection.getAllParticipants();
					const streamTypes_ = ['video', 'audio'];

					streamTypes_.forEach((type) => {
						if(participants.length > 0 && this.connection.extra.sessionStream[type] !== streamTypes.includes(type)) {
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
		this.restApi.showMsg('Closing...', 0).then((toast: any) => {
			this.restApi.put(this.apiEndPoint + '/close/' + this.item.id, {}).then((res: any) => {
				this.restApi.toast.dismiss();

				if(res.success === true) {
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
					this.restApi.showMsg(res.error);
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

		if(this.socket) {
			// send message to public room
			this.socket.emit(this.publicRoomIdentifier, {
				type: 'leave',
				status: this.item.status,
				speaker: this.isSpeaker,
				roomid: this.connection.sessionid
			});

			// if(this.status !== 'started') this.disconnectConnection();
			if(this.connection) this.disconnectConnection();
		}
	}

	disconnectConnection() {
		console.log('LEAVING PAGE', this.connection.sessionid);

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

		// close session
		// this.connection.closeSocket();

		setTimeout(() => {
			// close socket.io connection
			// this.connection.resetScreen();
			this.connection.closeSocket();
			// if(this.connection.extra.sessions[this.item.id]) this.connection.removeStream(this.connection.extra.sessions[this.item.id].localStream.id);
			this.connection.isInitiator = false;
			// this.rtcService.initConnection(this.connection.extra);
		}, 3000);
	}

	// ionViewDidLeave() {
	// 	console.log('PAGE LEAVED');

	// 	if(this.connection && this.connection.sessionid) {
	// 		// close socket.io connection
	// 		this.connection.closeSocket();
	// 		// this.connection.isInitiator = false;
	// 	}
	// }

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
		this.panelModal = this.panelModal === name ? null : name;

		switch (name) {
			case 'message':
				this.newMessage = false;
				break;
			default:
				break;
		}
	}

	sendMessage() {
		if(!this.message) return;

		const newMessage = {
			type: 'chat',
			text: this.message,
			firstName: this.user.firstName,
			lastName: this.user.lastName,
			userType: this.user.type
		};

		// send message
		this.connection.send(newMessage);
		this.messages.push(newMessage);

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
					handler: () => {}
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
				handler: () => {}
					}, 
					{
				text: 'Yes',
				handler: () => {
					this.restApi.showMsg('Deleting...', 0).then((toast: any) => {
						this.restApi.delete(this.apiEndPoint + '/' + this.item.id).then((res: any) => {
							this.restApi.toast.dismiss();

							if(res.success === true) {
								this.restApi.showMsg('Live Group Training ' + this.item.title + ' has been deleted!').then(() => {
									this.navCtrl.navigateRoot('/' + this.appUrl);
								});
							} else {
								this.restApi.showMsg(res.error);
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
					handler: () => {}
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
					handler: () => {}
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
		if(this.item.status !== 'started') {
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
						handler: () => {}
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
			if(this.item.participants[i].id == this.user.id) return true;
		}

		return false;
	}
}