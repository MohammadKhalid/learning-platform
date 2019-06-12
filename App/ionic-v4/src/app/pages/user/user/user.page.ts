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
	paramData: any;
	queryParams: any;
	detailLink: string;
	userCanAdd = ['admin', 'company'];

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

			this.activatedRoute.params.subscribe((data) => {
				this.paramData = data;
				this.getList();
			});
		});
	}

	getList() {
		let apiEndPoint: string;

		console.log('routeData', this.routeData);

		if(this.routeData.rootUrl !== this.routeData.type) {
			apiEndPoint = this.routeData.rootApiEndPoint + '/' + this.paramData.id + '/' + this.routeData.apiEndPoint;
			this.queryParams.type = this.routeData.type;

			this.detailLink = '/' + this.routeData.rootUrl + '/detail/' + this.paramData.id + '/' + this.routeData.type + '/';
		} else {
			apiEndPoint = this.routeData.apiEndPoint;
			this.detailLink = '/' + this.routeData.appUrl + '/detail/';
		}

		this.restApi.get(apiEndPoint, this.queryParams).subscribe((res: any) => {
			if(res.success === true) {
				this.items = res.items;
			} else {
				this.navCtrl.navigateRoot('/dashboard');
			}
		});
	}

	canAdd() {
		return this.userCanAdd.includes(this.sessionData.user.type);
	}
}