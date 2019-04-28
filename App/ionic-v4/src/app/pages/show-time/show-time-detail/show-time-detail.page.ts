import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../../../services/user/authentication.service';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-show-time-detail',
  templateUrl: './show-time-detail.page.html',
  styleUrls: ['./show-time-detail.page.scss'],
})
export class ShowTimeDetailPage implements OnInit {

	@ViewChild(IonContent) content: IonContent;

	url: any = { api: '', path: '' };
	data: any = { route: {} };

	constructor(
		private authService: AuthenticationService,
		private activatedRoute: ActivatedRoute
	) {
		this.data.session = this.authService.getSessionData();
	}

	ngOnInit() {
		this.activatedRoute.data.subscribe((routeData) => {
			this.data.route = routeData;
			
			this.url.path = this.data.route.type + '-time';
			this.url.api = this.url.path;
		});
	}
}