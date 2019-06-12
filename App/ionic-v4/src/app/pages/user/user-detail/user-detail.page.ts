import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../../services/user/authentication.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.page.html',
  styleUrls: ['./user-detail.page.scss'],
})
export class UserDetailPage implements OnInit {
	
	sessionData: any;
	routeData: any;
	paramData: any;
	backBtnLink: string;

	constructor(
		private activatedRoute: ActivatedRoute,
		private authService: AuthenticationService
	) {
		this.sessionData = this.authService.getSessionData();
	}

	ngOnInit() {
		this.activatedRoute.data.subscribe((data) => {
			this.routeData = data;

			this.activatedRoute.params.subscribe((data) => {
				this.paramData = data;
				
				if(this.routeData.rootUrl !== this.routeData.type) {
					this.backBtnLink = '/' + this.routeData.rootUrl + '/detail/' + this.paramData.userId + '/' + this.routeData.type;
				} else {
					this.backBtnLink = '/' + this.routeData.appUrl;
				}
			});
		});
	}
}