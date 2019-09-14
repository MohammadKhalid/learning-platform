import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../../services/user/authentication.service';

@Component({
  selector: 'app-live-group-training-session',
  templateUrl: './live-group-training-session.page.html',
  styleUrls: ['./live-group-training-session.page.scss'],
})
export class LiveGroupTrainingSessionPage implements OnInit {

	id: string;
	user: any = {};
	publicRoomIdentifier: string = 'live-group-training';
	
	appUrl: string = 'live-group-training';
	apiEndPoint: string = 'live-group-trainings';

	constructor(
		private navCtrl: NavController,
		private authService: AuthenticationService,
		private router: Router
	) {
		// set session val
		this.user = this.authService.getSessionData().user;

		// nav data
		const navigation = this.router.getCurrentNavigation();
		this.id = navigation.extras && navigation.extras.state ? navigation.extras.state.id : null;

		console.log('SESSION ID', this.id);
	}

	ngOnInit() {
		if(this.id) {
			
		} else {
			// navigate back to list
			this.navCtrl.navigateRoot('live-group-training');
		}
	}
}