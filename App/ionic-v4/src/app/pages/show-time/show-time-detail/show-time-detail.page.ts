import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController, ActionSheetController, IonContent } from '@ionic/angular';

import { RestApiService } from '../../../services/http/rest-api.service';
import { AuthenticationService } from '../../../services/user/authentication.service';
import { NotificationService } from '../../../services/notification/notification.service';

@Component({
  selector: 'app-show-time-detail',
  templateUrl: './show-time-detail.page.html',
  styleUrls: ['./show-time-detail.page.scss'],
})
export class ShowTimeDetailPage implements OnInit {

	@ViewChild(IonContent) content: IonContent;
	@ViewChild('submitWorkElem') submitWorkElem: ElementRef;

	item: any;
	url: any = { api: '', path: '' };
	data: any = { route: {} };
	routeParam: any;

	constructor(
		private notificationService: NotificationService,
    	private restApi: RestApiService,
		private authService: AuthenticationService,
		private activatedRoute: ActivatedRoute,
		private navCtrl: NavController,
		private alertCtrl: AlertController,
		private actionSheetCtrl: ActionSheetController
	) {
		this.data.session = this.authService.getSessionData().user;

		console.log('SESSION DATA', this.data.session);
	}

	ngOnInit() {
		this.activatedRoute.data.subscribe((routeData) => {
			this.data.route = routeData;
			
			this.url.path = this.data.route.type + '-time';
			this.url.api = this.url.path;

			this.activatedRoute.params.subscribe((paramData) => {
				this.routeParam = paramData;
				this.restApi.get(this.url.api + '/' + this.routeParam.id, {}).subscribe((resp: any) => {
					this.item = resp.item;
				});
			});
		});
	}

	presentPageAction() {
		const actionHeader: string = this.data.route.type.charAt(0).toUpperCase() + this.data.route.type.slice(1);;

		this.actionSheetCtrl.create({
			header: actionHeader,
			buttons: [
				// {	
				// 	text: 'Submit To',
				// 	icon: 'person-add',
				// 	handler: () => {
				// 		if(this.submitWorkElem) this.scrollToElem(this.submitWorkElem.nativeElement);
				// 	}
				// },
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
		const title = this.item.topic ? this.item.topic.title : 'Unknown';

    	this.alertCtrl.create({
    		header: 'Delete Confirmation',
    		message: 'Are you sure you want to delete this work for "' + title + '"?',
    		buttons: [
		        {
					text: 'Cancel',
					role: 'cancel',
					cssClass: 'secondary',
					handler: (blah) => {}
		        }, 
		        {
					text: 'Yes',
					handler: () => {
						this.notificationService.showMsg('Deleting...', 0).then((toast: any) => {
							this.restApi.delete(this.url.api + '/' + this.item.id).subscribe((res: any) => {
								this.notificationService.toast.dismiss();

								if(res.success === true) {
									this.notificationService.showMsg('Work ' + title + ' has been deleted!').then(() => {
										this.navCtrl.navigateRoot(this.url.api);
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
	
	scrollToElem(el: any) {
		if(this.content) {
    	const topElem: number = el.getBoundingClientRect().top - 50;
			this.content.scrollByPoint(0, topElem, 1200);
		}
  	}
}