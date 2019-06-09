import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { RestApiService } from '../../../services/http/rest-api.service';
import { AuthenticationService } from '../../../services/user/authentication.service';
import { RtcService } from '../../../services/rtc/rtc.service';
import { NotificationService } from '../../../services/notification/notification.service';

// modal
import { MediaComponent } from '../../../components/media/media.component';

import * as moment from 'moment';

@Component({
  selector: 'app-ask-expert-detail',
  templateUrl: './ask-expert-detail.page.html',
  styleUrls: ['./ask-expert-detail.page.scss'],
})
export class AskExpertDetailPage implements OnInit {

	form: FormGroup;
	submitted: boolean = false;
	medias: any = [];

	sessionData: any;
	item: any;
	paramData: any;
	mediaBaseUrl: string;

	constructor(
		private notificationService: NotificationService,
  		private restApi: RestApiService,
  		private authService: AuthenticationService,
        private activatedRoute: ActivatedRoute,
        private navCtrl: NavController,
        private actionSheetCtrl: ActionSheetController,
        private alertCtrl: AlertController,
        private formBuilder: FormBuilder,
        private modalCtrl: ModalController,
        private rtcService: RtcService,
	) {
		// set media base url
        this.mediaBaseUrl = this.restApi.url;

		this.sessionData = this.authService.getSessionData();
	}

	ngOnInit() {
		// this.rtcService.connection.socket.on('ask-expert-message', (message) => {
		// 	if(this.item.id === message.askExpertId) {
		// 		this.item.questionAnswers.push(message);

		// 		this.buildQuestionAnswerMediaPath();
		// 	}
		// });

		this.form = this.formBuilder.group({
			text: new FormControl('', Validators.required)
        });

		this.activatedRoute.params.subscribe((data) => {
			this.paramData = data;

			// load item
			if(this.paramData.id) {
				this.restApi.get('ask-expert/' + this.paramData.id, {}).subscribe((res: any) => {
					if(res.success === true) {
						this.item = res.item;
						this.buildMediaPath();
						this.buildQuestionAnswerMediaPath();
					} else {
						// navigate back to list
						this.notificationService.showMsg('Not found!').then(() => {
							this.navCtrl.navigateRoot('/ask-expert');
						});
					}
				});
			} else {
				// navigate back to list
				this.notificationService.showMsg('Not found!').then(() => {
					// this.navCtrl.navigateRoot('/topic');
				});
			}
		});
	}

	sendMessage() {
		if(this.form.valid) {
			this.submitted = true;

			// append media
			this.form.value.medias = [];

			for (var i = this.medias.length - 1; i >= 0; i--) {
				this.form.value.medias.push(this.medias[i].id);
			}

			this.notificationService.showMsg('Submitting...', 0).then(() => {
				this.restApi.post('ask-expert/question-answer/' + this.item.id, this.form.value).subscribe((res: any) => {
					this.submitted = false;

					if(res.success === true) {
						this.item.questionAnswers.push(res.item);

						this.rtcService.emitAskExpertQuestionAnswer(res.item);

						// build media path
						this.buildQuestionAnswerMediaPath();

						// clear media attachment
						this.medias = [];

						// clear form
						this.form.reset(true);
					}

					// dismiss message
					this.notificationService.toast.dismiss();
				});
			});
		}
	}

	buildMediaPath() {
		for (var i = this.item.medias.length - 1; i >= 0; i--) {
			let media 		= this.item.medias[i];

			let type		= media.type;
			let typeArray	= type.split('/')[0];

			let mediaPaths = [
				{ type: type, path: this.restApi.url + media.path }
			];

			if(typeArray === 'video' || type === 'application/octet-stream') {
				// mp4 path
				let mediaPath = media.path;

				let mediaPathArray 	= mediaPath.split('.');
				let mediaFileExt	= mediaPathArray[mediaPathArray.length - 1];
				
				if(mediaFileExt !== 'mp4') {
					let newMediaPathArray	= mediaPathArray;
						newMediaPathArray.pop();
					
					let newMediaPath 	= newMediaPathArray.join('.') + '.mp4';	
					mediaPaths.push({type: 'video/mp4', path: this.restApi.url + newMediaPath});
				}
			}

			this.item.medias[i].paths = mediaPaths;
		}
	}

	buildQuestionAnswerMediaPath() {
		for (var ii = this.item.questionAnswers.length - 1; ii >= 0; ii--) {
			for (var i = this.item.questionAnswers[ii].medias.length - 1; i >= 0; i--) {
				let media 		= this.item.questionAnswers[ii].medias[i];

				let type		= media.type;
				let typeArray	= type.split('/')[0];

				let mediaPaths = [
					{ type: type, path: this.restApi.url + media.path }
				];

				if(typeArray === 'video' || type === 'application/octet-stream') {
					// mp4 path
					let mediaPath = media.path;

					let mediaPathArray 	= mediaPath.split('.');
					let mediaFileExt	= mediaPathArray[mediaPathArray.length - 1];
					
					if(mediaFileExt !== 'mp4') {
						let newMediaPathArray	= mediaPathArray;
							newMediaPathArray.pop();
						
						let newMediaPath 	= newMediaPathArray.join('.') + '.mp4';	
						mediaPaths.push({type: 'video/mp4', path: this.restApi.url + newMediaPath});
					}
				}

				this.item.questionAnswers[ii].medias[i].paths = mediaPaths;
			}
		}
	}

	presentPageAction() {
		this.actionSheetCtrl.create({
			header: this.item.title,
			buttons: [
				{	
					text: 'Close',
					icon: 'add',
					handler: () => {
						// this.navCtrl.navigateRoot('/ask-expert/detail/' + this.item.id + '/challenge/add');
					}
				},
				{
					text: 'Edit',
					icon: 'create',
					handler: () => {
						this.navCtrl.navigateRoot('/ask-expert/edit/' + this.item.id);
					}
				},
				{
					text: 'Delete',
					role: 'destructive',
					icon: 'trash',
					handler: () => {
						this.alertCtrl.create({
							header: 'Delete Confirmation',
							subHeader: this.item.title,
							message: 'Are you sure you want to delete this topic?',
							buttons: [
								{
									text: 'Cancel',
									role: 'cancel'
								},
								{
									text: 'Yes',
									handler: () => {
										console.log('Confirm Okay');
									}
								}
							]
						}).then((alert) => {
							alert.present();
						});
					}
				},
				{
					text: 'Cancel',
					icon: 'close',
					role: 'cancel',
					handler: () => {
						console.log('Cancel clicked');
					}
				}
			]
		}).then((action) => {
			action.present();
		});
	}

	addMedia() {
		this.modalCtrl.create({
			component: MediaComponent,
			backdropDismiss: false
		}).then((modal) => {
			modal.onWillDismiss().then((data) => {
				if(data && data.data && data.data.items) this.medias = data.data.items;
			});

			modal.present();
		});
	}

	removeMedia(index: any) {
		this.medias.splice(index, 1);
	}

	beautifyDate(date: string, format: string = 'MMMM D, YYYY') {
        return moment(date).format(format);
    }

}