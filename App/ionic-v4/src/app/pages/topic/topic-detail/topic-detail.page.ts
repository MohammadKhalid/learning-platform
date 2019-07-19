import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, ActionSheetController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { RestApiService } from '../../../services/http/rest-api.service';
import { AuthenticationService } from '../../../services/user/authentication.service';
import { NotificationService } from '../../../services/notification/notification.service';

import { SERVER_URL } from '../../../../environments/environment';

@Component({
  selector: 'app-topic-detail',
  templateUrl: './topic-detail.page.html',
  styleUrls: ['./topic-detail.page.scss'],
})
export class TopicDetailPage implements OnInit {

	urlEndPoint: string = 'topic';
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
        private alertCtrl: AlertController
	) {
		// set media base url
        this.mediaBaseUrl = SERVER_URL;

		this.sessionData = this.authService.getSessionData();
	}

	ngOnInit() {
		this.activatedRoute.params.subscribe((data) => {
			this.paramData = data;

			// load item
			if(this.paramData.id) {
				this.restApi.get('topics/' + this.paramData.id, {}).subscribe((res: any) => {
					if(res.success === true) {
						this.item = res.item;
						this.buildMediaPath();
					} else {
						// navigate back to list
						this.notificationService.showMsg('Topic not found!').then(() => {
							this.navCtrl.navigateRoot('/topic');
						});
					}
				});
			} else {
				// navigate back to list
				this.notificationService.showMsg('Topic not found!').then(() => {
					// this.navCtrl.navigateRoot('/topic');
				});
			}
		});
	}

	buildMediaPath() {
		for (var ii = this.item.questions.length - 1; ii >= 0; ii--) {
			if(this.item.questions[ii].question) {
				for (var i = this.item.questions[ii].question.medias.length - 1; i >= 0; i--) {
					let media 		= this.item.questions[ii].question.medias[i];

					let type		= media.type;
					let typeArray	= type.split('/')[0];

					let mediaPaths = [
						{ type: type, path: this.mediaBaseUrl + media.path }
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
							mediaPaths.push({type: 'video/mp4', path: this.mediaBaseUrl + newMediaPath});
						}
					}

					this.item.questions[ii].question.medias[i].paths = mediaPaths;
				}
			}
		}
	}

	presentPageAction() {
		let actionButtons: Array<object> = [];

		// {	
		// 	text: 'Add Challenge',
		// 	icon: 'add',
		// 	handler: () => {
		// 		this.navCtrl.navigateRoot('/topic/detail/' + this.item.id + '/challenge/add');
		// 	}
		// },

		// add edit button
		// if(this.item.createdBy === this.sessionData.user.id) {
			actionButtons.push({
				text: 'Edit',
				icon: 'create',
				handler: () => {
					this.navCtrl.navigateRoot('/topic/edit/' + this.item.id);
				}
			});
		// }

		actionButtons.push({
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
								this.notificationService.showMsg('Deleting...', 0).then((toast: any) => {
									this.restApi.delete(this.urlEndPoint + 's/' + this.item.id).subscribe((res: any) => {
										this.notificationService.toast.dismiss();
		
										if(res.success === true) {
											this.notificationService.showMsg('Topic ' + this.item.title + ' has been deleted!').then(() => {
												this.navCtrl.navigateRoot(this.urlEndPoint);
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
		},
		{
			text: 'Cancel',
			icon: 'close',
			role: 'cancel',
			handler: () => {
				console.log('Cancel clicked');
			}
		});

		this.actionSheetCtrl.create({
			header: this.item.title,
			buttons: actionButtons
		}).then((action) => {
			action.present();
		});
	}

	viewMedia(item: any) {

	}

}