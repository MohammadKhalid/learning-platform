import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../services/user/authentication.service';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.page.html',
  styleUrls: ['./topic.page.scss'],
})
export class TopicPage implements OnInit {

	sessionData: any;
	
	constructor(private authService: AuthenticationService) {
		this.sessionData = this.authService.getSessionData();
	}

	ngOnInit() {}
}