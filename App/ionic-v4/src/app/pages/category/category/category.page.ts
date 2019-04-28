import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, NavController } from '@ionic/angular';

import { RestApiService } from '../../../services/http/rest-api.service';
import { AuthenticationService } from '../../../services/user/authentication.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {

	urlEndPoint: string = 'categories';
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
		this.restApi.get('categories', this.queryParams).then((res: any) => {
			if(res.success === true) {
				this.items = res.items;
			}
		});
	}

	canAdd() {
		return this.sessionData.user.type !== 'student' ? true : false;
	}

	presentActions(item: any, i: number) {
		this.actionSheetCtrl.create({
			header: item.title,
			buttons: [
				{
					text: 'Edit',
					icon: 'create',
					handler: () => {
						this.navCtrl.navigateRoot('/category/edit/' + item.id);
					}
				},
				{
					text: 'Delete',
			        role: 'destructive',
			        icon: 'trash',
			        handler: () => {
						this.alertCtrl.create({
							header: 'Confirm!',
							message: 'Are you sure you want to delete <strong>' + item.title + '</strong> category?',
							buttons: [
								{
									text: 'Cancel',
									role: 'cancel',
									cssClass: 'secondary',
									handler: () => {}
								}, {
									text: 'Yes',
									handler: () => {
										this.restApi.showMsg('Deleting...', 0).then((toast: any) => {
											this.restApi.delete(this.urlEndPoint + '/' + item.id).then((res: any) => {
												this.restApi.toast.dismiss();

												if(res.success === true) {
													this.restApi.showMsg('Category ' + item.title + ' has been deleted!').then(() => {


														this.items.splice(i, 1);
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