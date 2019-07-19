import { Component } from '@angular/core';
import { ActionSheetController, AlertController, NavController } from '@ionic/angular';

import { RestApiService } from '../../services/http/rest-api.service';
import { AuthenticationService } from '../../services/user/authentication.service';
import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss'],
})
export class TopicComponent {

  urlEndPoint: string = 'topics';
	sessionData: any;
	items: any = [];

	queryParams: any;
	isInfiniteScrollDisabled: boolean = false;
	searchBoxToolbarHidden: boolean = true;
	didSearch: boolean = false;

  constructor(
    protected restApi: RestApiService,
    protected notificationService: NotificationService,
    private authService: AuthenticationService,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) {
    // set query params
		this.setQueryParamsDefault();

		this.sessionData = this.authService.getSessionData();
  }

  loadData(event?: any) {
		this.restApi.get(this.urlEndPoint, this.queryParams).subscribe((res: any) => {
			if(res.success === true) {
				// push items
				this.items = this.items.concat(res.items);

				// update pagi
				if(res.items.length > 0) this.queryParams.pageNumber++;
			}

			// enable infinite scroll
			if(this.isInfiniteScrollDisabled) this.isInfiniteScrollDisabled = false;

			// hide loading indicator
			if(event && event.type === 'ionInfinite') {
				setTimeout(() => {
					event.target.complete();
				}, 500);
			}

			console.log('ITEMS', this.items);
		});
	}

	showHideSearchBox() {
		this.searchBoxToolbarHidden = this.searchBoxToolbarHidden ? false : true;
	}

	startSearch(event: any) {
		// ignore
		if(!event.detail.value) return;

		// disable infinite scroll
		this.isInfiniteScrollDisabled = true;

		// reset
		this.resetAll().then(() => {
			// set query
			this.queryParams.title = event.detail.value.trim();

			// query
			this.loadData(event);

			// flag search state
			this.didSearch = true;
		});
	}

	closeSearch(event: any) {
		// reset
		if(this.didSearch) {
			this.resetAll().then(() => {
				// query
				this.loadData(event);
			});
		}

		// flag search state
		this.didSearch = false;

		this.showHideSearchBox();
	}

	async resetAll() {
		// set query params
		this.setQueryParamsDefault();

		// reset items
		this.items = [];
	}

	setQueryParamsDefault() {
		this.queryParams = { pageNumber: 0, limit: 25 };
  }
  
  presentActions(item: any, i: number) {
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
										this.notificationService.showMsg('Deleting...', 0).then((toast: any) => {
											this.restApi.delete(this.urlEndPoint + '/' + item.id).subscribe((res: any) => {
												this.notificationService.toast.dismiss();

												if(res.success === true) {
													this.notificationService.showMsg('Topic ' + item.title + ' has been deleted!').then(() => {
														this.items.splice(i, 1);
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
					handler: () => {}
				}
			]
		}).then((action) => {
			action.present();
		});
	}
}