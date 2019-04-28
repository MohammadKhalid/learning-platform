import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { NavController } from '@ionic/angular';

import { RestApiService } from '../../../services/http/rest-api.service';
import { AuthenticationService } from '../../../services/user/authentication.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {

	sessionData: any;
	items: any = [];
	routeData: any;
	queryParams: any;

	constructor(
		private restApi: RestApiService,
		private authService: AuthenticationService,
		private activatedRoute: ActivatedRoute,
		private navCtrl: NavController
	) {
		this.queryParams = {
			pageNumber: 0,
			limit: 25
		};

		this.sessionData = this.authService.getSessionData();
	}

	ngOnInit() {
		this.activatedRoute.data.subscribe((data) => {
			this.routeData = data;

			this.getList();
		});
	}

	getList() {
		this.restApi.get(this.routeData.apiEndPoint, this.queryParams).then((res: any) => {
			if(res.success === true) {
				this.items = res.items;
			} else {
				this.navCtrl.navigateRoot('/dashboard');
			}
		});
	}

	canAdd() {
		return this.sessionData.user.type == 'admin' ? true : false;
	}

}