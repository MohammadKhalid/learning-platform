import { Injectable } from '@angular/core';

// import 'web-streams-polyfill';
// import adapter from 'webrtc-adapter';

// // let RecordRTC = require('recordrtc/RecordRTC.min');
// import RecordRTC from 'recordrtc/RecordRTC.min';
// import { WebAssemblyRecorder } from 'recordrtc';

@Injectable({
  providedIn: 'root'
})
export class RtcRecorderService {
  constructor() {}

  newRecorder() {
    // // return new RecordRTC(stream, config);

    // navigator.mediaDevices.getUserMedia({
		// 	video: {
		// 		width: {
		// 			ideal: 640
		// 		},
		// 		height: {
		// 			ideal: 480
		// 		}
		// 	},
		// 	audio: true
		// }).then((stream: MediaStream) => {
    //   let rec1 = new RecordRTC(stream, {
    //     recorderType: WebAssemblyRecorder,
    //     workerPath: '/assets/webm-wasm/webm-worker.js',
		// 	  webAssemblyPath: '/assets/webm-wasm/webm-wasm.wasm'
    //   });

    //   console.log('RTC', rec1);
      
    //   let rec2 = new RecordRTC(stream, {
    //     recorderType: RecordRTC.StereoAudioRecorder
    //   });

    //   rec1.initRecorder(() => {
    //     rec2.initRecorder(() => {
    //         // Both recorders are ready to record things accurately
    //         rec1.startRecording();
    //         rec2.startRecording();
    //     });
    //   });
    // });
  }

  stopRecorder() {
    
  }

}