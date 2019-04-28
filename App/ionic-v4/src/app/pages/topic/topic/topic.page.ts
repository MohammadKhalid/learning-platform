import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, NavController } from '@ionic/angular';

import { RestApiService } from '../../../services/http/rest-api.service';
import { AuthenticationService } from '../../../services/user/authentication.service';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.page.html',
  styleUrls: ['./topic.page.scss'],
})
export class TopicPage implements OnInit {

	sessionData: any;
	items: any = [];

	queryParams: any;

	constructor(
		private restApi: RestApiService,
  		private authService: AuthenticationService,
  		private actionSheetCtrl: ActionSheetController,
  		private alertCtrl: AlertController,
  		private navCtrl: NavController
	) {
		this.queryParams = {
			pageNumber: 0,
			limit: 25
		};

		this.sessionData = this.authService.getSessionData();
	}

	ngOnInit() {
		this.getList();
	}

	getList() {
		this.restApi.get('topics', this.queryParams).then((res: any) => {
			if(res.success === true) {
				this.items = res.items;
			}
		});
	}

	canAdd() {
		return this.sessionData.user.type !== 'student' ? true : false;
	}

	presentActions(item: any) {
		this.actionSheetCtrl.create({
			header: item.title,
			buttons: [
				{
					text: 'Edit',
					icon: 'create',
					handler: () => {
						this.navCtrl.navigateRoot('/topic/edit/' + item.id);
					}
				},
				{
					text: 'Delete',
			        role: 'destructive',
			        icon: 'trash',
			        handler: () => {
						this.alertCtrl.create({
							header: 'Confirm!',
							message: 'Are you sure you want to delete <strong>' + item.title + '</strong> topic?',
							buttons: [
								{
									text: 'Cancel',
									role: 'cancel',
									cssClass: 'secondary',
									handler: () => {}
								}, {
									text: 'Yes',
									handler: () => {
										
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
					handler: () => {}
				}
			]
		}).then((action) => {
			action.present();
		});
	}

}