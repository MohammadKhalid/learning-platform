import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpEventType } from '@angular/common/http';

// import { RtcRecorderService } from '../../services/rtc/rtc-recorder.service';
// import { RtcService } from '../../services/rtc/rtc.service';

// import Peer from 'peerjs';

// video recording
import { RecordRTCPromisesHandler, StereoAudioRecorder, WebAssemblyRecorder } from 'recordrtc';
// import MRecordRTC from 'recordrtc/RecordRTC';
// import StereoAudioRecorder from 'recordrtc';
// import RecordRTC from 'recordrtc';
import DetectRTC from 'detectrtc';
// let RecordRTC = require('recordrtc/RecordRTC.min');

import { RestApiService } from '../../services/http/rest-api.service';

import 'web-streams-polyfill';
import adapter from 'webrtc-adapter';

@Component({
	selector: 'app-test',
	templateUrl: './test.page.html',
	styleUrls: ['./test.page.scss'],
  })
  export class TestPage implements OnInit {
  
	@ViewChild('myvideo') myVideo: ElementRef;
	// @ViewChild('myvideoPreview') myvideoPreview: ElementRef;
	@ViewChild('videoContainer') myVideoContainer: ElementRef;

	video: HTMLMediaElement;
  
	peer: any;
	anotherid: any;
	mypeerid: any;
	localStream: any;

	recorderVideo: any;
	recorderAudio: any;

	videoUploaded: number = 0;
    videoFileSize: number = 1;

	stream: MediaStream;
	audioStream: MediaStream;
	videoStream: MediaStream;

	mimeType: string = 'video/mp4';
	mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
	// mimeType: string = 'video/webm';
	// mimeCodec = 'video/webm; codecs="vorbis,vp8"';
	previewMediaSrc: MediaSource;
	previewMediaSrcBuffer: SourceBuffer;
	recorderDataUrl: string;
	recorderFileObject: any;

	workerPath: string = 'https://archive.org/download/ffmpeg_asm/ffmpeg_asm.js';
	worker: any;
	// isFirefox = !!navigator.mozGetUserMedia;
	isFirefox: boolean = false;
	videoFile: string = 'video.webm';

	isVideoSupportsStreamCapturing: boolean;

	dataUrl: any = {
		audio: '',
		video: ''
	};

	cameraSettings: any;
  
	constructor(private restService: RestApiService) {
		// this.peer = this.rtcService.getPeer();

		// this.peerjs.getPeer().then((peerjs: any) => {
		// 	console.log('PEER JS ', peerjs);

		// 	this.peer = new peerjs.default();
		// });
	}
  
  	ngOnInit() {
		if(document.domain == 'localhost') {
			this.workerPath = location.href.replace(location.href.split('/').pop(), '') + 'assets/js/ffmpeg_asm.js';
		}

		// Detect RTC
		// media capturing flag
		this.isVideoSupportsStreamCapturing = DetectRTC.isVideoSupportsStreamCapturing;
		console.log('DETECT RTC isVideoSupportsStreamCapturing', this.isVideoSupportsStreamCapturing);

		// video elem
		this.video = this.myVideo.nativeElement;
		this.initUserMedia();

		// 	const sessionId = 'LGT-123';
		// 	this.peer = new Peer(sessionId);

		// 	this.peer.on('open', (id) => {
		// 		this.mypeerid = id;

		// 		console.log('My peer ID is: ' + id);
		// 		console.log('PEER CONN: ', this.peer.peerConnection);
		// 	});

		// 	this.peer.on('error', (e) => {
		// 		console.log('peer error: ', e.type);
		// 	});
			
		// // 	this.peer.on('connection', (dataConnection) => {
		// // 		console.log('DATA CONNECTION', dataConnection);
		// // 	// this.peer.on('connection', (conn: { on: (arg0: string, arg1: (data: any) => void) => void; }) => {
		// // 		// conn.on('data', (data: any) => {
		// // 		// 	// Will print 'hi!'
		// // 		// 	console.log(data);
		// // 		// });
		// // 	});

		// // 	this.peer.on('call', (mediaConnection) => {
		// // 		// Answer the call, providing our mediaStream
		// // 		console.log('LOCAL STREAM... ', this.localStream);
		// // 		console.log('ON CALL ', mediaConnection);

		// // 		mediaConnection.answer(this.localStream);

		// // 		mediaConnection.on('stream', (remotestream: any) => {
		// // 			console.log('REMOTE STREAM... ', remotestream);
		// // 			// video.src = URL.createObjectURL(remotestream);
		// // 			// video.play();
		// // 	})
		// // });

		// // let video = this.myVideo.nativeElement;
		// // const mediaConstraints = {
		// // 		video: true,
		// // 		audio: true
		// // };

		// // navigator.mediaDevices.getUserMedia(mediaConstraints)
		// // 	.then((stream) => {
		// // 		/* use the stream */
		// // 		this.localStream = stream;

		// // 		try {
		// // 			video.srcObject = this.localStream;
		// // 		} catch (error) {
		// // 			video.src = window.URL.createObjectURL(this.localStream);
		// // 		}

		// // 		console.log('GET NAVIGATOR STREAM ', this.localStream);

		// // 		video.autoplay = true;
		// // 		video.playsinline = true;
		// // 		video.volume = 0;
		// // 		video.muted = true;

		// // 		setTimeout(() => {
		// // 			video.play();
		// // 		}, 3000);
		// // 	})
		// // 	.catch((err) => {
		// // 		/* handle the error */
		// // 		console.log('GET STREAM ERROR ', err);
		// // 	});
	}
	
	// connect(){
		// var conn = this.peer.connect(this.anotherid);
		
		// console.log('Connecting to ... ', this.anotherid);

		// conn.on('open', () => {
		// 	console.log('Connected to ', this.anotherid);
		// 	// conn.send('Message from that id');

		// 	// Receive messages
		// 	conn.on('data', (data) => {
		// 		console.log('Received', data);
		// 	});
		// });

		// console.log('Connections ... ', this.peer.connections);

		// console.log('Calling to ... ', this.anotherid);
		// var call = this.peer.call(this.anotherid, this.localStream);

		// call.on('stream', (stream) => {
		// 	console.log('STREAM', stream);

		// 	// `stream` is the MediaStream of the remote peer.
		// 	// Here you'd add it to an HTML video/canvas element.
		// });
	// }

	// initRecorder() {
	// 	if ('MediaSource' in window && MediaSource.isTypeSupported(this.mimeCodec)) {
	// 		// let mediaSource = new MediaSource;
	// 		//console.log(mediaSource.readyState); // closed
	// 		console.log('Supported MIME type or codec: ', this.mimeCodec);
	// 	} else {
	// 		console.error('Unsupported MIME type or codec: ', this.mimeCodec);
	// 	}

	// 	const constraints = {
	// 		audio: true,
	// 		video: true
	// 	};

	// 	navigator.mediaDevices.getUserMedia(constraints).then((stream: MediaStream) => {
	// 		console.log('STREAM', stream);

	// 		this.stream = stream;
	// 		this.myVideo.nativeElement.srcObject = this.stream;

	// 		this.recorderAudio = RecordRTC(stream, {
	// 			type: this.isFirefox ? 'video' : 'audio',
	// 			recorderType: this.isFirefox ? RecordRTC.MediaStreamRecorder : RecordRTC.StereoAudioRecorder // force WebAudio for all browsers even for Firefox/MS-Edge
	// 		});

	// 		// todo: Firefox supports MediaRecorder API
	// 		// however it will record both audio/video tracks into single WebM
	// 		// Need to construct a MediaStream that is having no audio tracks
	// 		this.recorderVideo = RecordRTC(stream, {
	// 			type: this.videoFile.indexOf('gif') == -1 ? 'video' : 'gif',
	// 			recorderType: this.isFirefox ? RecordRTC.MediaStreamRecorder : RecordRTC.WhammyRecorder
	// 		});
	// 	});
	// }

	// async initRecorder_() {
	// 	await navigator.mediaDevices.getUserMedia({
	// 		// video: true,
	// 		video: {
	// 			width: { ideal: 1280 },
	// 			height: { ideal: 720 }
	// 		},
	// 		audio: { echoCancellation: true }
	// 	}).then((stream) => {
	// 		this.stream = stream;
			
	// 		// this.video.muted = true;
	// 		// this.video.volume = 0;
	// 		// this.video.play();

	// 		// media recorder
	// 		if(!this.isVideoSupportsStreamCapturing) {
	// 			this.recorderVideo = new RecordRTC.RecordRTCPromisesHandler(this.stream, {
	// 				type: 'video',
	// 				mimeType: 'video/webm'
	// 			});

	// 			try {
	// 				this.video.srcObject = stream;
	// 			} catch (error) {
	// 				this.video.src = URL.createObjectURL(stream);
	// 			}
	// 		} else {
	// 			// video
	// 			let videoTracks = this.stream.getVideoTracks();
					
	// 			this.videoStream = new MediaStream();
	// 			this.videoStream.addTrack(videoTracks[0]);

	// 			console.log('VIDEO STREAM', this.videoStream);

	// 			try {
	// 				this.video.srcObject = this.videoStream;
	// 			} catch (error) {
	// 				this.video.src = URL.createObjectURL(this.videoStream);
	// 			}
	
	// 			const videoWidth: number = this.myVideoContainer.nativeElement.clientWidth;
	// 			const videoHeight: number = this.myVideoContainer.nativeElement.clientHeight;
	
	// 			console.log('VIDEO ELEM', this.myVideoContainer);
	// 			console.log('VIDEO WIDTH', videoWidth);
	// 			console.log('VIDEO HEIGHT', videoHeight);

	// 			this.recorderVideo = new RecordRTC(this.videoStream, {
	// 				type: 'video',
	// 				recorderType: RecordRTC.WebAssemblyRecorder,
	// 				// workerPath: '/assets/webm-wasm/webm-worker.js',
	// 				// webAssemblyPath: '/assets/webm-wasm/webm-wasm.wasm',
	// 				width: 1280,
	// 				height: 720,
	// 				frameRate: 30,
	// 				bitrate: 1200
	// 			});
	
	// 			// release camera on stopRecording
	// 			// this.recorderVideo.camera = this.stream;
	
	// 			// audio
	// 			let audioTracks = this.stream.getAudioTracks();
				
	// 			this.audioStream = new MediaStream();
	// 			this.audioStream.addTrack(audioTracks[0]);
	
	// 			this.recorderAudio = new RecordRTC(this.audioStream, {
	// 				type: 'audio',
	// 				recorderType: RecordRTC.StereoAudioRecorder,
	// 				sampleRate: 44100,
	// 				desiredSampRate: 16000
	// 			});
	
	// 			console.log('RECORDER VIDEO', this.recorderVideo);
	// 			console.log('RECORDER AUDIO', this.recorderAudio);
	// 		}

	// 		// release camera on stopRecording
	// 		// this.recorderVideo.camera = this.stream;

	// 		console.log('DETECT RTC isVideoSupportsStreamCapturing', this.isVideoSupportsStreamCapturing);
	// 	});
	// }

	initUserMedia() {
		const mediaConstraints = !this.cameraSettings ? { video: true, audio: true } : {
			video: {
				width: { ideal: this.cameraSettings.width.max },
				height: { ideal: this.cameraSettings.height.max }
			},
			audio: { echoCancellation: true }
		};

		navigator.mediaDevices.getUserMedia(mediaConstraints).then((stream) => {
			if(!this.cameraSettings) {
				let track = stream.getVideoTracks()[0];
				this.cameraSettings = track.getCapabilities();

				return this.initUserMedia();
			}

			this.stream = stream;

			try {
				this.video.srcObject = this.stream;
			} catch (error) {
				this.video.src = URL.createObjectURL(this.videoStream);
			}

			this.video.muted = true;
			this.video.volume = 0;
			// this.video.play();
	
			// release camera on stopRecording
			// this.recorderVideo.camera = this.stream;
		});
	}

	startRecord() {
		if(this.isVideoSupportsStreamCapturing) {
			this.recorderVideo = new RecordRTCPromisesHandler(this.stream, {
				type: 'video',
				mimeType: 'video/webm'
			});

			this.recorderVideo.startRecording();
		} else {
			// video
			let videoTracks = this.stream.getVideoTracks();
				
			this.videoStream = new MediaStream();
			this.videoStream.addTrack(videoTracks[0]);

			this.recorderVideo = new WebAssemblyRecorder(this.videoStream, {
				// type: 'video',
				// recorderType: WebAssemblyRecorder,
				workerPath: '/assets/webm-wasm/webm-worker.js',
				webAssemblyPath: '/assets/webm-wasm/webm-wasm.wasm',
				width: this.cameraSettings.width.max,
				height: this.cameraSettings.height.max,
				frameRate: this.cameraSettings.frameRate.max,
				initCallback: () => {
					this.recorderAudio.record();
				}
				// timeSlice: 1000,
				// ondataavailable: function(blob) {
				// 	console.log('VIDEO DATAAAAAA');
				// }
			});

			// audio
			let audioTracks = this.stream.getAudioTracks();
			
			this.audioStream = new MediaStream();
			this.audioStream.addTrack(audioTracks[0]);

			this.recorderAudio = new StereoAudioRecorder(this.audioStream, {
				// type: 'audio',
				// recorderType: StereoAudioRecorder,
				// bufferSize: 0,
				numberOfAudioChannels: 1,
				// sampleRate: 44100,
				desiredSampRate: 16000
				// initCallback: () => {
				// 	this.recorderVideo.record();
				// }
				// timeSlice: 1000,
				// ondataavailable: (blob) => {
				// 	console.log('AUDIO DATA');
				// }
			});

			this.recorderVideo.record();
			
			console.log('RECORDER VIDEO', this.recorderVideo);
			console.log('RECORDER AUDIO', this.recorderAudio);
		}
	}

	async stopRecord() {
		if(this.isVideoSupportsStreamCapturing) {
			this.recorderVideo.stopRecording().then((dataURL) => {
				this.video.src = this.video.srcObject = null;
				this.video.src = dataURL;
			});
		} else {
			this.recorderAudio.stop((audioBlob) => {
				// this.recorderAudio.blob = audioBlob;

				setTimeout(() => {
					this.recorderVideo.stop((videoBlob) => {
						this.saveVideo(videoBlob, audioBlob);
					});
				});
			});
		}
	}

	saveVideo(videoBlob, audioBlob) {
		// console.log('RECORDER VIDEO STOP', this.recorderVideo);
		// console.log('RECORDER AUDIO STOP', this.recorderAudio);

		console.log('SAVING MEDIAAAAA', this.recorderVideo);

		// let videoBlob = this.recorderVideo.blob;
		// let audioBlob = this.recorderAudio.blob;

		// generating a random file name
		let videoFileName = this.getFileName('webm');
		let audioFileName = this.getFileName('wav');
		
        // we need to upload "File" --- not "Blob"
        let videoObject = new File([videoBlob], videoFileName, {
            type: 'video/webm'
		});
		let audioObject = new File([audioBlob], audioFileName, {
            type: 'audio/wav'
		});

        // create FormData
        let formData = new FormData();

		// formData.append('filename', fileObject.name);
		// formData.append('duration', this.textDuration.toString());
		formData.append('videoFileObject', videoObject);
		formData.append('audioFileObject', audioObject);

        // question id
        formData.append('questionId', '0');

        // append show time question id
        formData.append('topicQuestionId', '0');

        this.restService.postFormData('practice-time/answer/0', formData).subscribe((event) => {
            if (event.type === HttpEventType.UploadProgress) {
                let progress = Math.round(100 * event.loaded / event.total);

                //this.videoUploaded = progress;
                let p = Math.floor(Math.log(progress) / Math.log(1024));
                this.videoUploaded = Math.round(progress / Math.pow(1024, p));

                if(this.videoFileSize == 0) {
                    this.videoFileSize = 100;
                }

            } else if (event.type === HttpEventType.Response) {
                let data: any = event.body;

                // update
                console.log('RESULT DATA', data);
            }
        });
	}

	processInWebWorker() {
		let blob = URL.createObjectURL(new Blob(['importScripts("' + this.workerPath + '");var now = Date.now;function print(text) {postMessage({"type" : "stdout","data" : text});};onmessage = function(event) {var message = event.data;if (message.type === "command") {var Module = {print: print,printErr: print,files: message.files || [],arguments: message.arguments || [],TOTAL_MEMORY: message.TOTAL_MEMORY || false};postMessage({"type" : "start","data" : Module.arguments.join(" ")});postMessage({"type" : "stdout","data" : "Received command: " +Module.arguments.join(" ") +((Module.TOTAL_MEMORY) ? ".  Processing with " + Module.TOTAL_MEMORY + " bits." : "")});var time = now();var result = ffmpeg_run(Module);var totalTime = now() - time;postMessage({"type" : "stdout","data" : "Finished processing (took " + totalTime + "ms)"});postMessage({"type" : "done","data" : result,"time" : totalTime});}};postMessage({"type" : "ready"});'], {
			type: 'application/javascript'
		}));
		let worker = new Worker(blob);
		URL.revokeObjectURL(blob);
		return worker;
	}
	
	convertStreams(videoBlob, audioBlob) {
		var vab;
		var aab;
		var buffersReady;
		var workerReady;
		var posted = false;
		var fileReader1 = new FileReader();
		fileReader1.onload = (e: any) => {
			vab = e.target.result;
			if (aab) buffersReady = true;
			if (buffersReady && workerReady && !posted) postMessage();
		};
		var fileReader2 = new FileReader();
		fileReader2.onload = (e: any) => {
			aab = e.target.result;
			if (vab) buffersReady = true;
			if (buffersReady && workerReady && !posted) postMessage();
		};
		fileReader1.readAsArrayBuffer(videoBlob);
		fileReader2.readAsArrayBuffer(audioBlob);
		if (!this.worker) {
			this.worker = this.processInWebWorker();
		}
		
		this.worker.onmessage = (event) => {
			console.log('WORKER MSGGGG', event);

			var message = event.data;
			if (message.type == "ready") {
				this.log('<a href="'+ this.workerPath +'" download="ffmpeg-asm.js">ffmpeg-asm.js</a> file has been loaded.');
				workerReady = true;
				if (buffersReady)
					postMessage();
			} else if (message.type == "stdout") {
				this.log(message.data);
			} else if (message.type == "start") {
				this.log('<a href="'+ this.workerPath +'" download="ffmpeg-asm.js">ffmpeg-asm.js</a> file received ffmpeg command.');
			} else if (message.type == "done") {
				this.log(JSON.stringify(message));
				var result = message.data[0];
				this.log(JSON.stringify(result));
				var blob = new Blob([result.data], {
					type: 'video/mp4'
				});
				this.log(JSON.stringify(blob));
				this.postBlob(blob);
			}
		};
		
		var postMessage = () => {
			posted = true;
			if(this.isFirefox) {
				this.worker.postMessage({
					type: 'command',
					arguments: [
						'-i', this.videoFile,
						'-c:v', 'mpeg4',
						'-c:a', 'vorbis',
						'-b:v', '6400k',
						'-b:a', '4800k',
						'-strict', 'experimental', 'output.mp4'
					],
					files: [
						{
							data: new Uint8Array(vab),
							name: this.videoFile
						}
					]
				});
				return;
			}
			this.worker.postMessage({
				type: 'command',
				arguments: [
					'-i', this.videoFile,
					'-i', 'audio.wav',
					'-c:v', 'mpeg4',
					'-c:a', 'vorbis',
					'-b:v', '6400k',
					'-b:a', '4800k',
					'-strict', 'experimental', 'output.mp4'
				],
				files: [
					{
						data: new Uint8Array(vab),
						name: this.videoFile
					},
					{
						data: new Uint8Array(aab),
						name: "audio.wav"
					}
				]
			});
		};
	}
	
	postBlob(blob) {
		// var source = document.createElement('source');
		// 	source.src = URL.createObjectURL(blob);
		// 	source.type = 'video/webm';
		
		// 	this.myvideoPreview.nativeElement.appendChild(source);
		// this.myvideoPreview.nativeElement.src = URL.createObjectURL(blob);
		// this.myvideoPreview.nativeElement.play();

		let fileObject = new File([blob], 'xxx.mp4', {
            type: 'video/mp4'
		});
		const xxx = URL.createObjectURL(fileObject);


		console.log('POST BLOB', xxx);
	}

	// this function is used to generate random file name
	getFileName(fileExtension) {
        let d = new Date();
        let year = d.getUTCFullYear();
        let month = d.getUTCMonth();
        let date = d.getUTCDate();
        return 'THRIVE19-' + year + month + date + '-' + this.getRandomString() + '.' + fileExtension;
	}
	
	getRandomString() {
        if (window.crypto && window.crypto.getRandomValues && navigator.userAgent.indexOf('Safari') === -1) {
            let a = window.crypto.getRandomValues(new Uint32Array(3)),
                token = '';
            for (let i = 0, l = a.length; i < l; i++) {
                token += a[i].toString(36);
            }
            return token;
        } else {
            return (Math.random() * new Date().getTime()).toString(36).replace(/\./g, '');
        }
	}
	
	log(message) {
		console.log('LOGGG', message);
	}
}
