import { Component, OnInit, ViewChild } from '@angular/core';
// import { RtcService } from '../../services/rtc/rtc.service';

// import Peer from 'peerjs';

@Component({
	selector: 'app-test',
	templateUrl: './test.page.html',
	styleUrls: ['./test.page.scss'],
  })
  export class TestPage implements OnInit {
  
  	@ViewChild('myvideo') myVideo: any;
  
	peer: any;
	anotherid: any;
	mypeerid: any;
	localStream: any;
  
	constructor() {
		// this.peer = this.rtcService.getPeer();

		// this.peerjs.getPeer().then((peerjs: any) => {
		// 	console.log('PEER JS ', peerjs);

		// 	this.peer = new peerjs.default();
		// });
	}
  
  	ngOnInit() {
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
	
	connect(){
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

		console.log('Connections ... ', this.peer.connections);

		console.log('Calling to ... ', this.anotherid);
		var call = this.peer.call(this.anotherid, this.localStream);

		call.on('stream', (stream) => {
			console.log('STREAM', stream);

			// `stream` is the MediaStream of the remote peer.
			// Here you'd add it to an HTML video/canvas element.
		});
  	}
}
