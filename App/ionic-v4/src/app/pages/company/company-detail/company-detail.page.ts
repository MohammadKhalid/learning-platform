import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, ActionSheetController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { RestApiService } from '../../../services/http/rest-api.service';
import { AuthenticationService } from '../../../services/user/authentication.service';
import { NotificationService } from '../../../services/notification/notification.service';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.page.html',
  styleUrls: ['./company-detail.page.scss'],
})
export class CompanyDetailPage implements OnInit {

  urlEndPoint: string = 'company';
  apiEndPoint: string = 'companies';
	sessionData: any;
	item: any;
	paramData: any;

  constructor(
    private notificationService: NotificationService,
    private alertCtrl: AlertController, 
    private actionSheetCtrl: ActionSheetController, 
		private navCtrl: NavController,
		private activatedRoute: ActivatedRoute,
  	private restApi: RestApiService,
		private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((data) => {
			this.paramData = data;

			// load item
			if(this.paramData.id) {
				this.restApi.get(this.apiEndPoint + '/' + this.paramData.id, {}).subscribe((res: any) => {
          if(res.success) {
            this.item = res.item;
          } else {
            this.notificationService.showMsg(res.error).then(() => {
              this.navCtrl.navigateBack('/' + this.urlEndPoint);
            });
          }
        });
      } else {
				// navigate back to list
				this.notificationService.showMsg('Company not found!').then(() => {
					this.navCtrl.navigateBack('/' + this.urlEndPoint);
				});
      }
    });
  }

  presentActionSheet() {
    this.actionSheetCtrl.create({
      header: this.item.name,
      buttons: [
        {
          text: 'Edit',
          icon: 'create',
          handler: () => {
            this.navCtrl.navigateRoot('/' + this.urlEndPoint + '/edit/' + this.item.id);
          }
        },
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.alertCtrl.create({
              header: 'Confirmation Message',
              message: 'Are you sure you want to delete this company?',
              buttons: [
                {
                  text: 'Cancel',
                  role: 'cancel',
                  cssClass: 'secondary',
                  handler: () => {}
                }, {
                  text: 'Yes',
                  handler: () => {
                    this.notificationService.showMsg('Deleting...').then(() => {
                      this.restApi.delete(this.apiEndPoint + '/' + this.item.id).subscribe(() => {
                        this.notificationService.toast.dismiss();

                        this.notificationService.showMsg(this.item.name + ' has been deleted!').then(() => {
                          this.navCtrl.navigateRoot('/' + this.urlEndPoint);
                        });
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
