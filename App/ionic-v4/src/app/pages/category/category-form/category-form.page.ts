import { Component } from '@angular/core';
import { AuthenticationService } from '../../../services/user/authentication.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.page.html',
  styleUrls: ['./category-form.page.scss'],
})
export class CategoryFormPage {
	sessionData: any;

	constructor(
		private authService: AuthenticationService
	) {
		this.sessionData = this.authService.getSessionData();
	}
}