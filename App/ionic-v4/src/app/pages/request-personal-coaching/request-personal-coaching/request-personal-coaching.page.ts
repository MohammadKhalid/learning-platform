import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../services/user/authentication.service';

@Component({
  selector: 'app-request-personal-coaching',
  templateUrl: './request-personal-coaching.page.html',
  styleUrls: ['./request-personal-coaching.page.scss'],
})
export class RequestPersonalCoachingPage implements OnInit {

  sessionData: any;

  constructor(
    private authService: AuthenticationService
  ) {
    this.sessionData = this.authService.getSessionData();
  }

  ngOnInit() {
  }

}