import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestApiService } from '../../../services/http/rest-api.service';
import { AuthenticationService } from '../../../services/user/authentication.service';

import * as moment from 'moment';

@Component({
  selector: 'show-time',
  templateUrl: './show-time.component.html',
  styleUrls: ['./show-time.component.scss'],
})
export class ShowTimeComponent implements OnInit {
	url: any = {};
	data: any = {};
	items: any = [];
	detailColSize: number = 3;
	colSizeUserTypes: Array<string> = ['student', 'coach'];

	@Input('queryParams') queryParams: any = {};

	constructor(
		private activatedRoute: ActivatedRoute,
		private restApi: RestApiService,
		private authService: AuthenticationService
	) {
		this.data.session = this.authService.getSessionData();
	}

	ngOnInit() {
		// col size
		if(this.colSizeUserTypes.includes(this.data.session.user.type)) this.detailColSize = 4;

		if(!this.queryParams.pageNumber) this.queryParams.pageNumber = 0;
		if(!this.queryParams.limit) this.queryParams.limit = 0;

		this.activatedRoute.data.subscribe((routeData) => {
			this.data.route = routeData;
			
			this.url.path = this.data.route.type + '-time';
			this.url.api = this.url.path;
			this.url.pathDetail = this.url.path + '/detail';
		});

    this.loadData();
	}

	loadData(event?: any) {
		this.restApi.get(this.url.api, this.queryParams).subscribe((resp: any) => {
			if(resp.items.length > 0) {
				this.items = this.items.concat(resp.items);
				this.queryParams.pageNumber++;
			}

			// hide loading indicator
			if(event) {
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

	beautifyDate(date: string, format: string = 'MMMM D, YYYY') {
    return moment(date).format(format);
	}
	
	itemColor(i: number) {
		return i % 2 === 0 ? 'clean' : 'light';
	}
}