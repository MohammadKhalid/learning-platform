import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RestApiService } from '../../../services/http/rest-api.service';
import { AuthenticationService } from '../../../services/user/authentication.service';

import * as moment from 'moment';

@Component({
  selector: 'app-ask-expert',
  templateUrl: './ask-expert.page.html',
  styleUrls: ['./ask-expert.page.scss'],
})
export class AskExpertPage implements OnInit {

	urlEndPoint: string = 'ask-expert';
	isPractice: boolean;

	sessionData: any;
	items: any = [];

	queryParams: any;

	constructor(
		private restApi: RestApiService,
  		private authService: AuthenticationService,
  		private activatedRoute: ActivatedRoute
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
		this.restApi.get(this.urlEndPoint, this.queryParams).then((res: any) => {
			if(res.success === true) {
				this.items = res.items;
			}
		});
	}

	canAdd() {
		return this.sessionData.user.type == 'student' ? true : false;
	}

	beautifyDate(date: string, format: string = 'MMMM D, YYYY') {
        return moment(date).format(format);
    }
}