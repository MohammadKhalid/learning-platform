import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';

import { RestApiService } from '../../../services/http/rest-api.service';
import { AuthenticationService } from '../../../services/user/authentication.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.page.html',
  styleUrls: ['./company.page.scss'],
})
export class CompanyPage implements OnInit {
	items: any = [];
	sessionData: any;
	queryParams: any = {};
	searchBoxToolbarHidden: boolean = true;
	didSearch: boolean = false;
	segmentFilter: string = 'today';
	isInfiniteScrollDisabled: boolean = false;

	constructor(
		private alertCtrl: AlertController, 
		private navCtrl: NavController,
		private router: Router,
  		private restApi: RestApiService,
		private authService: AuthenticationService
	) {
		// set query params
		this.setQueryParamsDefault();

		// get user data
		this.sessionData = this.authService.getSessionData();
	}

	ngOnInit() {
		// load items
    this.loadData();
	}

	setQueryParamsDefault() {
		this.queryParams = { pageNumber: 0, limit: 25 };
	}

	loadData(event?: any) {
		console.log('LOAD EVENT ', event);
		console.log('QPARAMS ', this.queryParams);

		this.restApi.get('companies', this.queryParams).subscribe((resp: any) => {
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
				
					// App logic to determine if all data is loaded
					// and disable the infinite scroll
					// if (data.length == 1000) {
					// 	event.target.disabled = true;
					// }	
				}, 500);
			}
		});
	}

	canAdd() {
		return this.sessionData.user.type === 'admin' || this.sessionData.user.type === 'client' ? true : false;
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

	async showFilter() {
		const alert = await this.alertCtrl.create({
			header: 'Sort / Filter',
			inputs: [
			  {
				name: 'checkbox1',
				type: 'checkbox',
				label: 'Title',
				value: 'value1',
				checked: true
			  },
	  
			  {
				name: 'checkbox2',
				type: 'checkbox',
				label: 'Date',
				value: 'value2'
			  }
			],
			buttons: [
			  {
				text: 'Cancel',
				role: 'cancel',
				cssClass: 'secondary',
				handler: () => {}
			  }, {
				text: 'OK',
				handler: () => {
				}
			  }
			]
		});
	  
		await alert.present();
	}
}