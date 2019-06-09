import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { HttpEventType } from '@angular/common/http';
import { AlertController, NavController, ToastController, IonContent } from '@ionic/angular';

import { RestApiService } from '../../../services/http/rest-api.service';
import { ViewService } from '../../../services/view/view.service';
import { IonicSelectableComponent } from 'ionic-selectable';

import { RtcService } from '../../../services/rtc/rtc.service';
import { TimerService } from '../../../services/timer/timer.service';
import { NotificationService } from '../../../services/notification/notification.service';

import * as RecordRTC from 'recordrtc';
import adapter from 'webrtc-adapter';

@Component({
  selector: 'app-show-time-form',
  templateUrl: './show-time-form.page.html',
  styleUrls: ['./show-time-form.page.scss'],
})
export class ShowTimeFormPage implements OnInit, OnDestroy {
    showTime: any;
    isPractice: boolean;

    url: any = {};
	data: any = {};

    @ViewChild(IonContent) content: IonContent;

    // showRecordingCompatMessage: boolean = false;
    recordRTC: any;

    topics: any = [];
    form: any = {};

    @ViewChild('videoRecorder') videoElement: any;

    video: HTMLVideoElement;
    videoStatus: string = "stop";
    textStatus: string = "ready";
    recordingDuration: number;
    textDuration: number;

    videoUploaded: number = 0;
    videoFileSize: number = 1;

    step: number = 1;
    questionNumber: number = 1;
    question: any = {};
    coaches: any = [];
    showRecordingCompatMessage: boolean = false;

    showChallenge: boolean = false;
    showChallengeCountDownTime: number = 5;

    mediaBaseUrl: string;
    isShowTutorial: boolean = false;
    
    @ViewChild('teleprompterContainer') teleprompterContainerElement: ElementRef;
    @ViewChild('teleprompt') teleprompterElement: ElementRef;
    telepromptContainerElement: any;
    telepromptElement: any;
    telepromptWorkTrack: string;
    initTelepromptSpeed: number = 50;
    initTelepromptFontSizes = ['xx-small', 'x-small', 'small', 'medium', 'large', 'x-large', 'xx-large'];
    telepromptScrollDelay: any;
    teleprompterPlaying: boolean = false;
    teleprompterPreviewEnabled: boolean = false;

    countDownTimer: any;
    countDownTimeLeft: number;

    statusColor = {
        stop: 'success',
        recording: 'danger',
        initializing: 'primary',
        ready: 'warning'
    };

    segment: string = 'topic';
    segmentNext: any;
    segmentPrev: any;
    isCustomTopic: boolean = false;

    constructor(
        private notificationService: NotificationService,
        private restService: RestApiService,
        private alertCtrl: AlertController,
        private toastCtrl: ToastController,
        private navCtrl: NavController,
        private viewService: ViewService,
        private rtcService: RtcService,
        private timeService: TimerService,
        private activatedRoute: ActivatedRoute
    ) {
        // set media base url
        this.mediaBaseUrl = this.restService.url;

        // get topics
        this.restService.get('topics', {}).subscribe((res: any) => {
            let items = [];

            for (var i = res.items.length - 1; i >= 0; i--) {
                const topic = res.items[i];
                const categories = topic.categories;

                // no category
                if(categories.length < 1) {
                    topic.category = {
                        id: 0,
                        title: 'Uncategorized'
                    }

                    items.push(topic);
                } else {
                    for (var ii = categories.length - 1; ii >= 0; ii--) {
                        let category = categories[ii];
                            topic.category = {
                                id: category.id,
                                title: category.title
                            }

                            items.push(topic);
                    }
                }
            }

            this.topics = items;
        });

        // get coaches
        this.restService.get('form-input-data', {}).subscribe((resp: any) => {
            if(resp.data.coaches) this.coaches = resp.data.coaches;
        });
    }

    ngOnInit() {
        // get route data
        this.activatedRoute.data.subscribe((routeData) => {
            // set vars
            this.data.route = routeData;
            this.url.api = routeData.type + '-time';
            this.url.path = this.url.api;

            if(this.data.route.type === 'practice') this.isPractice = true;
        });
    }

    showTutorial() {
        this.isShowTutorial = !this.isShowTutorial;
    }

    segmentButtonClicked(ev: any) {
        this.segmentNext = ev.target.nextSibling;
        this.segmentPrev = ev.target.previousSibling;
    }

    goToSegment(direction: string) {
        if(direction === 'next') this.segmentNext.click();
        else if(direction === 'prev') this.segmentPrev.click();
    }

    customTopicToggle(ev: any) {
        this.resetFormTopic();
        this.isCustomTopic = ev.detail.checked;

        if(this.isCustomTopic) {
            this.form.questions = [{
                question: { 
                    answerLimit: true,
                    answerLimitTime: 60
                }
            }];
        }
    }

    initNativeElem() {
        if(this.isPractice) {
            this.telepromptContainerElement = this.teleprompterContainerElement.nativeElement;
            this.telepromptElement = this.teleprompterElement.nativeElement;
        }

        // set the initial state of the video
        this.video = this.videoElement.nativeElement;

        this.video.oncanplay = () => {
            console.log('Video can play');
        };

        this.video.muted = true;
        this.video.controls = false;
        this.video.autoplay = true;
    }

    teleprompterChangeFontSize(ev: any) {
        this.telepromptElement.style.fontSize = this.initTelepromptFontSizes[ev.detail.value];
    }

    telepromptPreview() {
        this.teleprompterPreviewEnabled = true;
        this.teleprompterPlaying ? this.telepromptStop() : this.telepromptStart();
    }

    telepromptStart() {
        this.teleprompterPlaying = true;

        setTimeout(() => {
            // set padding top to set position at bottom
            const telepromptContainerHeight = this.telepromptContainerElement.offsetHeight;

            this.telepromptElement.style.paddingTop = (telepromptContainerHeight - 30) + 'px';
            this.telepromptElement.style.paddingBottom = (telepromptContainerHeight + 30) + 'px';

            this.telepromptScroll();
        });
    }

    telepromptScroll = () => {
        this.telepromptContainerElement.scrollTop = this.telepromptContainerElement.scrollTop + 1;

        clearTimeout(this.telepromptScrollDelay);
        this.telepromptScrollDelay = setTimeout(this.telepromptScroll, 100 - this.initTelepromptSpeed);

        // We're at the bottom of the document, stop
        if(this.telepromptContainerElement.scrollTop >= ( ( this.telepromptContainerElement.scrollHeight - this.telepromptContainerElement.getBoundingClientRect().height ) - 100 )) {
            if(!this.teleprompterPreviewEnabled) {
                this.telepromptStop();
            } else {
                setTimeout(() => {
                    this.telepromptContainerElement.scrollTop = 0;
                }, 500);
            }
        }
    }

    // Stop Teleprompter
    telepromptStop() {
        clearTimeout(this.telepromptScrollDelay);

        this.teleprompterPlaying = false;
        this.teleprompterPreviewEnabled = false;
        this.telepromptContainerElement.scrollTop = 0;
    }

    startCountDown() {
        this.videoStatus = 'ready';
        this.textStatus = 'get ready';

        this.countDownTimer = this.timeService.countDownTimer(3).subscribe((time) => {
            this.countDownTimeLeft = time;

            if(time <= 0) {
                this.countDownTimer.unsubscribe();
                this.countDownTimeLeft = null;

                try {
                    if(this.isPractice && (this.question.question.script || this.telepromptWorkTrack)) this.telepromptStart();

                    this.videoStatus = 'recording';
                    this.textStatus = this.videoStatus;

                    this.recordRTC.startRecording();
                } catch {
                    this.content.scrollToTop().then(() => {
                        this.showRecordingCompatMessage = true;
                    });
                }
            }
        });
    }

    videoInit() {
        const mediaConstraints = {
            video: true,
            audio: true
        };
        
        navigator.mediaDevices.getUserMedia(mediaConstraints).then((camera) => {
            this.video.setAttribute('autoplay', '');
            this.video.setAttribute('playsinline', '');
            this.video.setAttribute('muted', '');

            try {
                this.video.srcObject = camera;
            } catch (error) {
                this.video.src = window.URL.createObjectURL(camera);
            }

            let options: any = {
                type: 'video',
                mimeType: 'video/webm',
                //mimeType: 'video/webm\;codecs=h264', // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
                // audioBitsPerSecond: 128000,
                // videoBitsPerSecond: 128000,
                // bitsPerSecond: 128000 // if this line is provided, skip above two
                timeSlice: 1000, // pass this parameter
                onTimeStamp: (timestamp, timestamps) => {
                    let duration = Math.round((new Date().getTime() - timestamps[0]) / 1000);

                    console.log('DURATION', duration);

                    if(duration < 1) return;

                    this.textDuration = duration;
                }
            };

            this.recordRTC = RecordRTC(camera, options);

            // release camera on stopRecording
            this.recordRTC.camera = camera;

            // set duration
            if(this.question.question.answerLimit) this.setRecorderDuration();
        }, (err) => {
            console.log(err.name + ": " + err.message);
        });
    }

    setRecorderDuration() {
        // set recording limit
        this.recordingDuration = this.question.question.answerLimitTime * 1000;
        this.recordRTC.setRecordingDuration(this.recordingDuration + 1000).onRecordingStopped((data) => this.stopRecordingCallback(data));
    }

    confirmStartRecording() {
        this.alertCtrl.create({
            mode: 'ios',
            header: 'Confirm!',
            message: 'Start Recording?',
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
                        // init save
                        this.initSave().then(() => {
                            this.startShowChallenge();
                        });
                    }
                }
            ]
        }).then((alert) => {
            alert.present();
        });
    }

    startShowChallenge() {
        this.isShowTutorial = false;

        this.videoStatus = 'ready';
        this.textStatus = 'get ready';
        this.showChallenge = true;

        setTimeout(() => {
            this.countDownTimer = this.timeService.countDownTimer(this.showChallengeCountDownTime - 1).subscribe((time) => {
                this.countDownTimeLeft = time;

                if(time <= 0) {
                    this.countDownTimer.unsubscribe();
                    this.countDownTimeLeft = null;
                    this.showChallenge = false;

                    try {
                        this.recordRTC.startRecording();

                        this.videoStatus = 'recording';
                        this.textStatus = this.videoStatus;

                        // start teleprompter
                        if(this.isPractice && (this.question.question.script || this.telepromptWorkTrack)) this.telepromptStart();

                        // deactivate view leave
                        this.viewService.state.next(false);
                    } catch {
                        this.content.scrollToTop().then(() => {
                            this.showRecordingCompatMessage = true;
                        });
                    }
                }
            });
        }, 1500);
    }

    presentAlertWordTrack() {
        this.alertCtrl.create({
            mode: 'ios',
            header: 'Word-track',
            inputs: [
                {
                    name: 'wordTrack',
                    type: 'text',
                    placeholder: 'Enter word-track',
                    value: this.telepromptWorkTrack
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {}
                }, 
                {
                    text: 'OK',
                    handler: (data) => {
                        this.telepromptWorkTrack = data.wordTrack;
                    }
                }
            ]
        }).then((alert) => {
            alert.present();
        });
    }

    startRecording() {
        // stop telepromter
        if(this.teleprompterPlaying) this.telepromptStop();

        if(this.isPractice) this.startShowChallenge();
        else this.confirmStartRecording();
    }

    stopRecording(): void {
        this.recordRTC.stopRecording((data) => this.stopRecordingCallback(data));
    }

    stopRecordingCallback(data): void {
        // close camera
        this.video.src = this.video.srcObject = null;
        this.video.src = data;

        // video controls
        this.toggleControls();

        if(this.isPractice) {
            this.videoStatus = 'done';
            this.textStatus = 'done';

            this.telepromptStop();

            // activate view leave
            this.viewService.state.next(true);
        } else {
            // save
            this.save();
        }
    }

    resetRecording(): void {
        if(this.isPractice) {
            this.videoStatus = 'stop';
            this.textStatus = 'ready';
        } else {
            this.videoStatus = 'ready';
            this.textStatus = 'get ready';
        }

        this.textDuration = 0;

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

    async initSave() {
        this.videoStatus = 'initializing';
        this.textStatus = this.videoStatus;

        let formData = this.isCustomTopic ? this.form : {
            topicId: this.form.topicId,
            submittedTo: this.form.submittedTo,
            sendTo: this.form.sendTo
        };

        return await this.restService.post(this.url.api, formData).subscribe((res: any) => {
            if(res.success === true) {
                if(this.isCustomTopic) this.question = res.topic.questions[0];

                this.showTime = res.item;
            } else {
                this.notificationService.showMsg(res.error);
            }

            return res;
        });
    }

    save() {
        // save show time first if not yet added
        if(!this.showTime) this.initSave().then(() => { if(this.showTime) this.saving() });
        else this.saving();
    }

    saving() {
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

        // formData.append('filename', fileObject.name);
        formData.append('fileObject', fileObject);
        formData.append('duration', this.textDuration.toString());

        // question id
        formData.append('questionId', this.question.question.id);

        // append show time question id
        formData.append('topicQuestionId', this.question.id);

        this.restService.postFormData(this.url.api + '/answer/' + this.showTime.id, formData).subscribe((event) => {
            if (event.type === HttpEventType.UploadProgress) {
                let progress = Math.round(100 * event.loaded / event.total);

                //this.videoUploaded = progress;
                let p = Math.floor(Math.log(progress) / Math.log(1024));
                this.videoUploaded = Math.round(progress / Math.pow(1024, p));

                if(this.videoFileSize == 0) {
                    this.videoFileSize = 100;
                }

            } else if (event.type === HttpEventType.Response) {
                this.textStatus = 'saving...';

                let data: any = event.body;

                // update
                if(data.success === true) {
                    // done
                    if(this.questionNumber == this.form.questions.length) {
                        // close camera
                        this.recordRTC.camera.stop();

                        // show message
                        this.toastCtrl.create({
                            message: data.message ? data.message : 'Congratulations!',
                            duration: 3000
                        }).then((toast) => {
                            toast.present();
                        });

                        // activate view leave
                        this.viewService.state.next(true);

                        // update status
                        this.restService.put(this.url.api + '/' + this.showTime.id, { status: 'completed' }).subscribe(() => {

                            // go to detail
                            this.navCtrl.navigateRoot('/' + this.url.api + '/detail/' + this.showTime.id).then(() => {
                                // notify user
                                if(this.showTime.submittedTo) {
                                    this.rtcService.emitShowTimeCreated({
                                        userId: this.showTime.userId,
                                        submittedTo: this.showTime.submittedTo,
                                        title: this.form.title,
                                        type: this.data.route.type
                                    });
                                }

                                // submit
                                if(this.form.sendTo) this.restService.put(this.url.api + '/submit/' + this.showTime.id, { submittedTo: this.form.submittedTo, sendTo: this.form.sendTo });
                            });
                        });
                    } else {
                        this.resetRecording();

                        // next challenge
                        this.question = this.form.questions[this.questionNumber];
                        this.questionNumber++;

                        // set duration
                        if(this.question.question.answerLimit) this.setRecorderDuration();

                        // clear word-tracker
                        this.telepromptWorkTrack = null;

                        // auto start next challenge
                        this.startShowChallenge();
                    }
                } else {
                    this.videoStatus = 'done';
                    this.textStatus = 'done';
                }
            }
        });
    }

    async alertInstruction() {
        const alert = await this.alertCtrl.create({
            header: 'Before you start',
            subHeader: 'Read the instructions carefully',
            message: '<p>When you click on Start Recording various objections will appear on your screen. There are <strong>' + this.form.questions.length +  '</strong> in total and during the recording you are expected to overcome each of them either using some of the example word-tracks we have provided you within "Practice Time", or other effective word-tracks that you may have learn’t from your manager or elsewhere.</p><p><br>Remember you only get <strong>one chance at recording</strong> this so please make sure you feel confident.</p>',
            backdropDismiss: false,
            buttons: [
                {
                    text: 'Got it!',
                    handler: () => {}
                }
            ]
        });

        await alert.present();
    }

    toggleControls() {
        this.video.muted = !this.video.muted;
        this.video.controls = !this.video.controls;
        this.video.autoplay = !this.video.autoplay;
    }

    // move to next step
    slideNext() {
        this.initNativeElem();

        this.content.scrollToTop().then(() => {
            this.form.submittedAt = new Date(Date.now()).toISOString();

            this.step = this.step + 1;
            this.question = this.form.questions[this.questionNumber - 1];

            this.videoInit();

            // show instruction
            if(!this.isPractice) setTimeout(() => this.alertInstruction(), 3000);
        });
    }

    selectableCoachChange(event: {
        component: IonicSelectableComponent,
        value: any
    }) {
        if(event.value && event.value.id) {
            this.form.submittedTo = event.value.id;
            this.form.coach = event.value.name;
        } else {
            this.form.submittedTo = null;
            this.form.coach = null;
        }
    }

    selectableChange(event: {
        component: IonicSelectableComponent,
        value: any
    }) {
        if(event.value && event.value.id) {
            this.form.topicId = event.value.id;
            this.form.title = event.value.title;
            this.form.description = event.value.description;
            this.form.content = event.value.content;
            this.form.questions = event.value.questions;

            this.buildMediaPath();
        } else {
            this.resetFormTopic();
        }
    }

    resetFormTopic() {
        delete this.form.topicId;
        delete this.form.title;
        delete this.form.description;
        delete this.form.content;
        delete this.form.questions;
    }

    buildMediaPath() {
        for (var ii = this.form.questions.length - 1; ii >= 0; ii--) {
            for (var i = this.form.questions[ii].question.medias.length - 1; i >= 0; i--) {
                let media         = this.form.questions[ii].question.medias[i];

                let type        = media.type;
                let typeArray    = type.split('/')[0];

                let mediaPaths = [
                    { type: type, path: this.restService.url + media.path }
                ];

                if(typeArray === 'video' || type === 'application/octet-stream') {
                    // mp4 path
                    let mediaPath = media.path;

                    let mediaPathArray     = mediaPath.split('.');
                    let mediaFileExt    = mediaPathArray[mediaPathArray.length - 1];
                    
                    if(mediaFileExt !== 'mp4') {
                        let newMediaPathArray    = mediaPathArray;
                            newMediaPathArray.pop();
                        
                        let newMediaPath     = newMediaPathArray.join('.') + '.mp4';    
                        mediaPaths.push({type: 'video/mp4', path: this.restService.url + newMediaPath});
                    }
                }

                this.form.questions[ii].question.medias[i].paths = mediaPaths;
            }
        }
    }

    scrollTo(scrollToElem: ElementRef) {
        const topElem: number = scrollToElem.nativeElement.getBoundingClientRect().top - 50;
        this.content.scrollByPoint(0, topElem, 1200);
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

    ionViewWillLeave() {
        // close camera
    	if(this.recordRTC) this.recordRTC.camera.stop();
    }

    ngOnDestroy() {
        // log
        if(!this.isPractice && this.showTime) this.restService.put(this.url.api + '/' + this.showTime.id, { status: 'completed', comment: 'user leave the page' });
    }
}