import { Component, OnInit } from '@angular/core';
import { NavController, ActionSheetController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationExtras } from '@angular/router';

import { RestApiService } from '../../../services/http/rest-api.service';
import { AuthenticationService } from '../../../services/user/authentication.service';

import * as moment from 'moment';

@Component({
  selector: 'app-live-group-training-detail',
  templateUrl: './live-group-training-detail.page.html',
  styleUrls: ['./live-group-training-detail.page.scss'],
})
export class LiveGroupTrainingDetailPage implements OnInit {

	urlEndPoint: string = 'live-group-training';
	item: any;
	routeParam: any;
	sessionData: any;
	allowedAction: string;

	constructor(
		private restApi: RestApiService,
		private navCtrl: NavController,
		private actionSheetCtrl: ActionSheetController,
		private alertCtrl: AlertController,
		private activatedRoute: ActivatedRoute,
		private authService: AuthenticationService
	) {
		this.sessionData = this.authService.getSessionData();
	}

	ngOnInit() {
		// get url param data
		this.activatedRoute.params.subscribe((param) => {
			this.routeParam = param;

			// load
			this.restApi.get(this.urlEndPoint + 's/' + this.routeParam.id, {}).then((resp: any) => {
	        	this.item = resp.item;

	        	if(this.item.speakerId == this.sessionData.user.id) {
	        		this.allowedAction = 'start';
	        	} else if(this.item.status === 'open') {
							if(this.item.public === true) {
								this.allowedAction = 'join';
							} else {
								this.isParticipant().then((res: boolean) => {
									if(res) {
										this.allowedAction = 'join';
									} else {
										this.allowedAction = 'locked';
									}
								});
							}
	        	}
	        });
		});
	}

	async isParticipant() {
	 	for (let i = this.item.participants.length - 1; i >= 0; i--) {
			if(this.item.participants[i].id === this.sessionData.user.id) return true;
		}

		return false;
	}

	presentPageAction() {
		this.actionSheetCtrl.create({
			header: this.item.title,
			buttons: [
				{	
					text: 'Edit',
					icon: 'create',
					handler: () => {
						this.navCtrl.navigateRoot('/' + this.urlEndPoint + '/edit/1');
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
						this.restApi.delete(this.urlEndPoint + 's/' + this.item.id).then((res: any) => {
							this.restApi.toast.dismiss();

							if(res.success === true) {
								this.restApi.showMsg('Live Group Training ' + this.item.title + ' has been deleted!').then(() => {
									this.navCtrl.navigateRoot('/' + this.urlEndPoint);
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

	gotoSession() {
		let navigationExtras: NavigationExtras = {
			state: {
				id: this.item.id
			}
		};

		this.navCtrl.navigateForward('/live-group-training/session', { state: this.item });
	}

	beautifyDate(date: string, format: string = 'MMMM D, YYYY') {
        return moment(date).format(format);
    }

}