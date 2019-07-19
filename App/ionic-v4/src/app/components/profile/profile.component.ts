import { Component, OnInit } from '@angular/core';

import { NavController, ActionSheetController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { RestApiService } from '../../services/http/rest-api.service';
import { AuthenticationService } from '../../services/user/authentication.service';
import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  sessionData: any;
	item: any;
	paramData: any;
	routeData: any;
	mediaBaseUrl: string;
	linkBaseUrl: string;
	userType: string;

  constructor(
		private notificationService: NotificationService,
		private restApi: RestApiService,
		private authService: AuthenticationService,
		private activatedRoute: ActivatedRoute,
		private navCtrl: NavController,
		private actionSheetCtrl: ActionSheetController,
		private alertCtrl: AlertController
	) {
		console.log('USER DETAIL CONSTRUCT');

		// set media base url
    this.mediaBaseUrl = this.restApi.url;

		this.sessionData = this.authService.getSessionData();
	}

	ngOnInit() {
		console.log('USER DETAIL INIT');

		this.activatedRoute.data.subscribe((data) => {
			this.routeData = data;

			this.activatedRoute.params.subscribe((data) => {
				this.paramData = data;

				if(this.routeData.rootUrl !== this.routeData.type) {
					if(this.paramData.userId) {
						this.linkBaseUrl = '/' + this.routeData.rootUrl + '/detail/' + this.paramData.userId + '/' + this.routeData.type + '/' + this.paramData.id;
						this.userType = this.routeData.type;

						console.log('TYPE 1', this.userType);
					} else {
						this.linkBaseUrl = '/' + this.routeData.rootUrl + '/detail/' + this.paramData.id + '/' + this.routeData.type;
						this.userType = this.routeData.type;

						console.log('TYPE 1A', this.userType);
					}
				} else {
					this.linkBaseUrl = '/' + this.routeData.appUrl + '/detail/' + this.paramData.id;
					this.userType = this.routeData.type;
					console.log('TYPE 2', this.userType);
				}

				console.log('TYPE', this.userType);
	
				// set id
				const id = this.routeData.type === 'profile' ? '/' : '/' + this.paramData.id;

				if(id) {
					this.restApi.get(this.routeData.apiEndPoint + id, {}).subscribe((res: any) => {
						if(res.success === true) {
							this.item = res.item;
						} else {
							// navigate back to list
							this.notificationService.showMsg(this.routeData.singular + ' not found!').then(() => {
								this.navCtrl.navigateRoot('/' + this.routeData.appUrl);
							});
						}
					});
				} else {
					// navigate back to list
					this.notificationService.showMsg(this.routeData.singular + ' not found!').then(() => {
	
					});
				}
			});
		});
	}

	// presentPageAction() {
	// 	const id = this.routeData.type === 'profile' ? '' : '/' + this.item.id;

	// 	let actions: any = [
	// 		{
	// 			text: 'Edit',
	// 			icon: 'create',
	// 			handler: () => {
	// 				console.log('ROUTE DATA ID', '/' + this.routeData.appUrl + '/edit' + id);
	// 				this.navCtrl.navigateRoot('/' + this.routeData.appUrl + '/edit' + id);
	// 			}
	// 		}
	// 	];

	// 	if(this.routeData.type !== 'profile') {
	// 		actions.push({
	// 			text: 'Delete',
	// 			role: 'destructive',
	// 			icon: 'trash',
	// 			handler: () => {
	// 				this.alertCtrl.create({
	// 					header: 'Delete Confirmation',
	// 					subHeader: this.item.title,
	// 					message: 'Are you sure you want to delete this ' + this.routeData.singular + '?',
	// 					buttons: [
	// 						{
	// 							text: 'Cancel',
	// 							role: 'cancel'
	// 						},
	// 						{
	// 							text: 'Yes',
	// 							handler: () => {
	// 								this.notificationService.showMsg('Deleting...', 0).then((toast: any) => {
	// 									this.restApi.delete(this.routeData.apiEndPoint + '/' + this.item.id).subscribe((res: any) => {
	// 										this.notificationService.toast.dismiss();
			
	// 										if(res.success === true) {
	// 											this.notificationService.showMsg(this.routeData.singular + ' ' + this.item.firstName + ' ' + this.item.lastName + ' has been deleted!').then(() => {
	// 												this.navCtrl.navigateRoot(this.routeData.appUrl);
	// 											});
	// 										} else {
	// 											this.notificationService.showMsg(res.error);
	// 										}
	// 									});
	// 								});
	// 							}
	// 						}
	// 					]
	// 				}).then((alert) => {
	// 					alert.present();
	// 				});
	// 			}
	// 		});
	// 	}

	// 	// cancel
	// 	actions.push({
	// 		text: 'Cancel',
	// 		icon: 'close',
	// 		role: 'cancel',
	// 		handler: () => {
	// 			console.log('Cancel clicked');
	// 		}
	// 	});

	// 	this.actionSheetCtrl.create({
	// 		header: this.item.title,
	// 		buttons: actions
	// 	}).then((action) => {
	// 		action.present();
	// 	});
	// }

	get itemValue() {
		return this.item;
	}

}
