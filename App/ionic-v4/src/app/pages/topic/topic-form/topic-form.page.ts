import { Component } from '@angular/core';
import { AuthenticationService } from '../../../services/user/authentication.service';

@Component({
  selector: 'app-topic-form',
  templateUrl: './topic-form.page.html',
  styleUrls: ['./topic-form.page.scss'],
})
export class TopicFormPage {
	sessionData: any;

	constructor(
		private authService: AuthenticationService
	) {
		this.sessionData = this.authService.getSessionData();
	}
}