import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { NavController, AlertController, ActionSheetController, IonContent } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IonicSelectableComponent } from 'ionic-selectable';

import { PublicRestApiService } from '../../../services/http/public-rest-api.service';
import { RestApiService } from '../../../services/http/rest-api.service';
import { AuthenticationService } from '../../../services/user/authentication.service';
import { RtcService } from '../../../services/rtc/rtc.service';
import { NotificationService } from '../../../services/notification/notification.service';

import * as moment from 'moment';

@Component({
  selector: 'show-time-detail',
  templateUrl: './show-time-detail.component.html',
  styleUrls: ['./show-time-detail.component.scss'],
})
export class ShowTimeDetailComponent implements OnInit {

@Input('url') url: any = { api: 'show-time', path: 'show-time' };
@Input('content') content: IonContent;
  
	item: any;
	sessionData: any;
	routeParam: any;
	coaches: any = [];

	reviewForm: FormGroup;
	submitToCoachForm: FormGroup;

	answers: any = {};
	mediaBasePath: string;

	@ViewChild('submitWorkElem') submitWorkElem: ElementRef;
	@ViewChild('submitReviewElem') submitReviewElem: ElementRef;

	constructor(
		private notificationService: NotificationService,
		private restApi: RestApiService,
		private publicRestApi: PublicRestApiService,
    	private activatedRoute: ActivatedRoute,
		private navCtrl: NavController,
		private alertCtrl: AlertController,
		private authService: AuthenticationService,
		private rtcService: RtcService,
		private actionSheetCtrl: ActionSheetController
	) {
		this.sessionData = this.authService.getSessionData();
		this.mediaBasePath = this.publicRestApi.url;

		// get related data
		this.restApi.get('show-time/form-input-data', {}).subscribe((resp: any) => {
			this.coaches = resp.coaches;
		});
	}

	ngOnInit() {
		this.activatedRoute.params.subscribe((paramData) => {
		this.routeParam = paramData;

		// load
		this.restApi.get(this.url.api + '/' + this.routeParam.id, {}).subscribe((resp: any) => {
			if(resp.success === true) {
			this.item = resp.item;
			
			this.buildMediaPath();
			this.buildAnswers();

			// review form
			if(!this.item.rating && this.sessionData.user.id === this.item.submittedTo) {
				this.reviewForm = new FormGroup({
						rating: new FormControl('neutral', [Validators.required]),
						comment: new FormControl('', [Validators.required])
					});
			} else if(!this.item.submittedTo && this.sessionData.user.id === this.item.userId) {
				// submit to form
				this.submitToCoachForm = new FormGroup({
						submittedTo: new FormControl('', [Validators.required]),
						sendTo: new FormControl('')
					});
			}

			} else {
				// navigate to page not found
				this.navCtrl.navigateRoot(this.url.api);
			}
		});
		});
	}

	// presentPageAction() {
	// 	this.actionSheetCtrl.create({
	// 		header: this.item.title,
	// 		buttons: [
	// 			{	
	// 				text: 'Submit To',
	// 				icon: 'person-add',
	// 				handler: () => {
	// 					this.scrollToElem(this.submitWorkElem.nativeElement);
	// 				}
	// 			},
	// 			{
	// 				text: 'Delete',
	// 				role: 'destructive',
	// 				icon: 'trash',
	// 				handler: () => {
	// 					this.confirmDelete();
	// 				}
	// 			},
	// 			{
	// 				text: 'Cancel',
	// 				icon: 'close',
	// 				role: 'cancel',
	// 				handler: () => {}
	// 			}
	// 		]
	// 	}).then((action) => {
	// 		action.present();
	// 	});
	// }

	buildMediaPath() {
		if(this.item.topic) {
			// @TODO. refactor - created reusable function instead
			for (var ii = this.item.topic.questions.length - 1; ii >= 0; ii--) {
				for (var i = this.item.topic.questions[ii].question.medias.length - 1; i >= 0; i--) {
					let media 		= this.item.topic.questions[ii].question.medias[i];

					let type		= media.type;
					let typeArray	= type.split('/')[0];

					let mediaPaths = [
						{ type: type, path: this.mediaBasePath + media.path }
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
							mediaPaths.push({type: 'video/mp4', path: this.mediaBasePath + newMediaPath});
						}
					}

					this.item.topic.questions[ii].question.medias[i].paths = mediaPaths;
				}
			}
		}
	}

	buildAnswers() {
		// @TODO. refactor - created reusable function instead
		for (var ii = this.item.answers.length - 1; ii >= 0; ii--) {
			for (var i = this.item.answers[ii].medias.length - 1; i >= 0; i--) {
				let media 		= this.item.answers[ii].medias[i];

				let type		= media.type;
				let typeArray	= type.split('/')[0];

				let mediaPaths = [
					{ type: type, path: this.mediaBasePath + media.path }
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
						mediaPaths.push({type: 'video/mp4', path: this.mediaBasePath + newMediaPath});
					}
				}

				this.item.answers[ii].medias[i].paths = mediaPaths;
			}

			this.answers[this.item.answers[ii].ShowTimeAnswer.topicQuestionId] = this.item.answers[ii];
		}
	}

	submitReview() {
		this.alertCtrl.create({
    		header: 'Confirmation',
    		message: 'Are you sure you want to submit your evaluation?',
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
						if(this.reviewForm.valid) {
							this.notificationService.showMsg('Submitting...', 0).then((toast: any) => {
								this.restApi.put(this.url.api + '/review/' + this.item.id, this.reviewForm.value).subscribe((res: any) => {
									this.notificationService.toast.dismiss();

									if(res.success === true) {
										this.notificationService.showMsg('Review has been submitted!').then(() => {
											this.navCtrl.navigateRoot(this.url.api);
										});

										// notify log user
										this.rtcService.emitShowTimeReviewed({
											userId: this.item.userId,
											submittedTo: this.item.submittedTo,
											title: this.item.topic.title,
											type: 'show'
										});
									} else {
										this.notificationService.showMsg(res.error);
									}
								});
							});
						}
					}
		        }
			]
    	}).then((alert) => {
    		alert.present();	
    	});
	}

	submitToCoach() {
		if(this.submitToCoachForm.valid) {
			this.notificationService.showMsg('Submitting...', 0).then((toast: any) => {
				this.restApi.put(this.url.api + '/submit/' + this.item.id, this.submitToCoachForm.value).subscribe((res: any) => {
					this.notificationService.toast.dismiss();

					if(res.success === true) {
						this.notificationService.showMsg('Work ' + this.item.topic.title + ' has been submitted!').then(() => {
							this.navCtrl.navigateRoot(this.url.api);
						});

						// notify log user
						this.rtcService.emitShowTimeCreated({
							userId: this.item.userId,
							submittedTo: this.item.submittedTo,
							title: this.item.topic.title,
							type: 'Show'
						});
					} else {
						this.notificationService.showMsg(res.error);
					}
				});
			});
		}
	}

	selectCoachChange(event: {
        component: IonicSelectableComponent,
        value: any
    }) {
        // this.selectedParticipants = event.value;
        this.submitToCoachForm.controls.submittedTo.setValue(event.value.id);
    }

    // confirmDelete() {
	// 	const title = this.item.topic ? this.item.topic.title : 'Unknown';

    // 	this.alertCtrl.create({
    // 		header: 'Delete Confirmation',
    // 		message: 'Are you sure you want to delete this work for "' + title + '"?',
    // 		buttons: [
	// 	        {
	// 				text: 'Cancel',
	// 				role: 'cancel',
	// 				cssClass: 'secondary',
	// 				handler: (blah) => {}
	// 	        }, 
	// 	        {
	// 				text: 'Yes',
	// 				handler: () => {
	// 					this.notificationService.showMsg('Deleting...', 0).then((toast: any) => {
	// 						this.restApi.delete(this.url.api + '/' + this.item.id).subscribe((res: any) => {
	// 							this.notificationService.toast.dismiss();

	// 							if(res.success === true) {
	// 								this.notificationService.showMsg('Work ' + title + ' has been deleted!').then(() => {
	// 									this.navCtrl.navigateRoot(this.url.api);
	// 								});
	// 							} else {
	// 								this.notificationService.showMsg(res.error);
	// 							}
	// 						});
	// 					});
	// 				}
	// 	        }
	// 		]
    // 	}).then((alert) => {
    // 		alert.present();	
    // 	});
    // }

	beautifyDate(date: string, format: string = 'MMMM D, YYYY') {
      return moment(date).format(format);
  }

  scrollToElem(el: any) {
		if(this.content) {
    	const topElem: number = el.getBoundingClientRect().top - 50;
			this.content.scrollByPoint(0, topElem, 1200);
		}
  }

}
