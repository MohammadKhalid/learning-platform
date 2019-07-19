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
	userCanAdd = ['admin', 'client'];
	searchBoxToolbarHidden: boolean = true;
	isInfiniteScrollDisabled: boolean = false;
	didSearch: boolean = false;

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
				this.loadData();
			});
		});
	}

	loadData(event?: any) {
		let apiEndPoint: string;

		if(this.routeData.rootUrl !== this.routeData.type) {
			apiEndPoint = this.routeData.rootApiEndPoint + '/' + this.paramData.id + '/' + this.routeData.apiEndPoint;
			this.queryParams.type = this.routeData.type;

			this.detailLink = '/' + this.routeData.rootUrl + '/detail/' + this.paramData.id + '/' + this.routeData.type + '/';
		} else {
			apiEndPoint = this.routeData.apiEndPoint;
			this.detailLink = '/' + this.routeData.appUrl + '/detail/';
		}

		this.restApi.get(apiEndPoint, this.queryParams).subscribe((resp: any) => {
			// push items
			this.items = this.items.concat(resp.items);

			if(resp.items.length > 0) {
				// update pagi
				this.queryParams.pageNumber++;
			}

			// enable infinite scroll
			if(this.isInfiniteScrollDisabled) this.isInfiniteScrollDisabled = false;

			// hide loading indicator
			if(event && event.type === 'ionInfinite') {
				setTimeout(() => {
					event.target.complete();
				}, 500);
			}
		});
	}

	canAdd() {
		return this.userCanAdd.includes(this.sessionData.user.type);
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
			this.queryParams.searchQuery = event.detail.value.trim();

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
}