import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, IonContent, IonInput } from '@ionic/angular';
import { HttpEventType } from '@angular/common/http';
import { UploadEvent, UploadFile, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';

import { RestApiService } from '../../services/http/rest-api.service';

import * as RecordRTC from 'recordrtc';
import adapter from 'webrtc-adapter';

@Component({
	selector: 'app-media',
	templateUrl: './media.component.html',
	styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {

	items: any = [];

	tab: string = 'list';
	data: any = {}; 

	files: any = [];
	fileUploaded: number;
	fileSize: number;
	fileUploading: boolean = false;
	selectedItems: any = [];

	@ViewChild(IonContent) content: IonContent;
    @ViewChild('browseFileInput') browseFileInput: IonInput;

    showRecordingCompatMessage: boolean = false;
    recordRTC: any;

    @ViewChild('videoRecorder') videoElement: any;

    video: HTMLVideoElement;
    videoStatus: string = "stop";
    textStatus: string = "ready";
    textDuration: number = 0;

    videoUploaded: number = 0;
    videoFileSize: number = 0;

	constructor(
		private restService: RestApiService,
		private modalCtrl: ModalController
	) {}

	ngOnInit() {
		this.restService.get('medias', {}).then((res: any) => {
			if(res.success === true) {
				this.items = res.items;
			}
		});
	}

	close() {
		this.modalCtrl.dismiss(this.data).then(() => {
            if(this.recordRTC) this.recordRTC.camera.stop();
        });
	}

	showTab(tab: any) {
		this.tab = tab.detail.value;

        // init media recorder
        if(this.tab === 'record') this.videoInit();
        else if(this.recordRTC) this.stopRecording();
	}

    uploadFiles(ev: any) {
        // let srcElem = ev.srcElement
        // console.log('uploaded files', ev.target.files);
    }

    browseFile() {
        this.browseFileInput.getInputElement().then((fileInputEl: HTMLInputElement) => {
            fileInputEl.click();
        });
    }
 
  	dropped(event: UploadEvent) {
  		// set files data
	    this.files = event.files;

	    // set upload status
	    this.fileUploading = true;

	    for (let i = event.files.length - 1; i >= 0; i--) {
            let droppedFile = event.files[i];
            
            this.getUploadedFile(droppedFile).then((file) => {
                if(file) {
                    // set status
                    // this.files[i].uploading = true;

                    // upload status
                    this.files[i].status = 'uploading';

                    // Here you can access the real file
                    //console.log(droppedFile.relativePath, file);

                    // You could upload it like this:
                    const formData = new FormData()
                    formData.append('file', file, droppedFile.relativePath);

                    this.restService.postFormData('medias', formData,).subscribe((event: any) => {
                        if (event.type === HttpEventType.UploadProgress) {
                            let progress = Math.round(100 * event.loaded / event.total);

                            let p = Math.floor(Math.log(progress) / Math.log(1024));
                            this.fileUploaded = Math.round(progress / Math.pow(1024, p));

                            if(this.fileSize == 0) {
                                this.fileSize = 100;
                            }

                        } else if (event.type === HttpEventType.Response) {
                            let data: any = event.body;

                            if(data.success === true) {
                                // upload status
                                this.files[i].status = 'uploaded';

                                // append filename
                                data.item.filename = file.name;

                                this.selectedItems.push(data.item);
                            } else {
                                // upload status
                                this.files[i].status = 'failed';
                            }

                            // close modal
                            if(this.files.length - 1 == i) this.modalCtrl.dismiss({ items: this.selectedItems });
                        }
                    });
                } else {
                    // upload status
                    this.files[i].status = 'invalid';
                }
            });
	    }
	}

    getUploadedFile(droppedFile: any): Promise<any> {
        return new Promise((resolve, reject) => {
            // Is it a file?
            if (droppedFile.fileEntry && droppedFile.fileEntry.isFile) {
                const droppedFileEntry = droppedFile.fileEntry as FileSystemFileEntry;

                droppedFileEntry.file((file: File) => {
                    return resolve(file);
                });
            } else {
                return resolve(droppedFile);
            }
        });
    }

	selectChange(item: any) {
		if(this.selectedItems.includes(item)) this.selectedItems.splice(item, 1);
		else this.selectedItems.push(item);
	}

	select() {
		this.modalCtrl.dismiss({ items: this.selectedItems });
	}
 
	fileOver(event){
    	// console.log(event);
	}
 
	fileLeave(event){
    	// console.log(event);
	}

	videoInit() {
        // set the initial state of the video
        this.video = this.videoElement.nativeElement;

        this.video.muted = true;
        this.video.controls = false;
        this.video.autoplay = true;

        const mediaConstraints = {
            video: true,
            audio: true
        };
        
        navigator.mediaDevices.getUserMedia(mediaConstraints).then((camera) => {
            try {
                this.video.srcObject = camera;
            } catch (error) {
                this.video.src = window.URL.createObjectURL(camera);
            }

            let options: any = {
                type: 'video',
                mimeType: 'video/webm',
                timeSlice: 1000, // pass this parameter
                onTimeStamp: (timestamp, timestamps) => {
                    let duration = Math.round((new Date().getTime() - timestamps[0]) / 1000);
                    if(duration < 1) return;

                    this.textDuration = duration;
                }
            };

            this.recordRTC = RecordRTC(camera, options);

            // release camera on stopRecording
            this.recordRTC.camera = camera;
        }).catch((err) => {
            console.log(err.name + ": " + err.message);
        });
    }

    startRecording() {
        try {
            this.recordRTC.startRecording();

            this.videoStatus = 'recording';
            this.textStatus = this.videoStatus;
        } catch {
            this.content.scrollToTop().then(() => {
                this.showRecordingCompatMessage = true;
            });
        }
    }

    toggleControls() {
        this.video.muted = !this.video.muted;
        this.video.controls = !this.video.controls;
        this.video.autoplay = !this.video.autoplay;
    }

    stopRecording() {
        // this.recordRTC.stopRecording((data) => this.stopRecordingCallback(data));
        this.recordRTC.stopRecording((data) => this.stopRecordingCallback(data));
    }

    stopRecordingCallback(data) {
        this.videoStatus = 'done';
        this.textStatus = 'done';

        // close camera
        this.video.src = this.video.srcObject = null;
        this.video.src = data;

        // this.recordRTC.camera.stop();

        // video controls
        this.toggleControls();
    }

    resetRecording() {
        this.videoStatus = 'stop';
        this.textStatus = 'ready';

        this.video.src = this.video.srcObject = null;
        try {
            this.video.srcObject = this.recordRTC.camera;
        } catch (error) {
            this.video.src = window.URL.createObjectURL(this.recordRTC.camera);
        }

        // video controls
        this.toggleControls();

        this.recordRTC.reset();
    }

    saveRecord() {
        this.videoStatus = 'uploading';
        this.textStatus = 'uploading';

        this.videoUploaded = 0;
        this.videoFileSize = 0;

        let blob = this.recordRTC.getBlob();

        // generating a random file name
        let fileName = this.getFileName('webm');
        // we need to upload "File" --- not "Blob"
        let fileObject = new File([blob], fileName, {
            type: 'video/webm'
        });

        // create FormData
        let formData = new FormData();

        formData.append('videoFilename', fileObject.name);
        formData.append('videoObject', fileObject);
        formData.append('videoDuration', this.textDuration.toString());

        this.restService.postFormData('medias', formData).subscribe((event) => {
            if (event.type === HttpEventType.UploadProgress) {
                let progress = Math.round(100 * event.loaded / event.total);

                //this.videoUploaded = progress;
                let p = Math.floor(Math.log(progress) / Math.log(1024));
                this.videoUploaded = Math.round(progress / Math.pow(1024, p));

                if(this.videoFileSize == 0) {
                    this.videoFileSize = 100;
                }

            } else if (event.type === HttpEventType.Response) {
                this.textStatus = 'saving, please wait...';

                let data: any = event.body;

                if(data.success === true) {
                    // append filename
                    data.item.filename = fileName;

                    this.modalCtrl.dismiss({items: [ data.item ]}).then(() => {
                        if(this.recordRTC) this.recordRTC.camera.stop();
                    });
                } else {
                    this.resetRecording();
                }
            }
        });
    }

    // this function is used to generate random file name
    getFileName(fileExtension) {
        let d = new Date();
        let year = d.getUTCFullYear();
        let month = d.getUTCMonth();
        let date = d.getUTCDate();
        return 'Thrive19-' + year + month + date + '-' + this.getRandomString() + '.' + fileExtension;
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

}
