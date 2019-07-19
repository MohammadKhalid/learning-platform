import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ActionSheetController, AlertController } from '@ionic/angular';

import { AuthenticationService } from '../../../services/user/authentication.service';
import { RestApiService } from '../../../services/http/rest-api.service';
import { NotificationService } from '../../../services/notification/notification.service';

// import { ProfileComponent } from '../../../components/profile/profile.component';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.page.html',
  styleUrls: ['./user-detail.page.scss'],
})
export class UserDetailPage implements OnInit {

	// @ViewChild(ProfileComponent) profile;
	
	sessionData: any;
	routeData: any;
	paramData: any;
	backBtnLink: string;
	item: any;

	constructor(
		private activatedRoute: ActivatedRoute,
		private authService: AuthenticationService,
		private navCtrl: NavController,
		private actionSheetCtrl: ActionSheetController,
		private alertCtrl: AlertController,
		private notificationService: NotificationService,
		private restApi: RestApiService
	) {
		this.sessionData = this.authService.getSessionData();
	}

	ngOnInit() {
		this.activatedRoute.data.subscribe((data) => {
			this.routeData = data;

			this.activatedRoute.params.subscribe((data) => {
				this.paramData = data;
				
				if(this.routeData.rootUrl !== this.routeData.type) {
					this.backBtnLink = '/' + this.routeData.rootUrl + '/detail/' + this.paramData.userId + '/' + this.routeData.type;
				} else {
					this.backBtnLink = '/' + this.routeData.appUrl;
				}
			});
		});
	}

	presentPageAction() {
		// console.log('COMPONENT', this.profile);
		// console.log('ITEM', this.item);

		const id = this.paramData.id;

		let actions: any = [
			// {
			// 	text: 'Edit',
			// 	icon: 'create',
			// 	handler: () => {
			// 		console.log('ROUTE DATA ID', '/' + this.routeData.appUrl + '/edit/' + id);
			// 		this.navCtrl.navigateRoot('/' + this.routeData.appUrl + '/edit/' + id);
			// 	}
			// }
		];

		if(this.routeData.type !== 'profile') {
			actions.push({
				text: 'Delete',
				role: 'destructive',
				icon: 'trash',
				handler: () => {
					this.alertCtrl.create({
						header: 'Delete Confirmation',
						message: 'Are you sure you want to delete this ' + this.routeData.singular + '?',
						buttons: [
							{
								text: 'Cancel',
								role: 'cancel'
							},
							{
								text: 'Yes',
								handler: () => {
									this.notificationService.showMsg('Deleting...', 0).then((toast: any) => {
										this.restApi.delete(this.routeData.apiEndPoint + '/' + id).subscribe((res: any) => {
											this.notificationService.toast.dismiss();
			
											if(res.success === true) {
												// this.notificationService.showMsg(this.routeData.singular + ' ' + this.item.firstName + ' ' + this.item.lastName + ' has been deleted!').then(() => {
													this.notificationService.showMsg(this.routeData.singular + ' has been deleted!').then(() => {
													this.navCtrl.navigateRoot(this.routeData.appUrl);
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
			});
		}

		// cancel
		actions.push({
			text: 'Cancel',
			icon: 'close',
			role: 'cancel',
			handler: () => {
				console.log('Cancel clicked');
			}
		});

		const actionHeader: string = this.routeData.singular.charAt(0).toUpperCase() + this.routeData.singular.slice(1);
		this.actionSheetCtrl.create({
			header: actionHeader,
			buttons: actions
		}).then((action) => {
			action.present();
		});
	}
}