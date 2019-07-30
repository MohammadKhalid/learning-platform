import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../../../../services/http/rest-api.service';
import { AuthenticationService } from '../../../../services/user/authentication.service';
@Component({
  selector: 'app-concepts',
  templateUrl: './concepts.page.html',
  styleUrls: ['./concepts.page.scss'],
})
export class ConceptsPage implements OnInit {

  addMore = [{ data: 'Mohsin' }]
  conceptOptions = [];
  sessionData: any;
  user: any;
  selectedOption: any;

  constructor(
    private restApi: RestApiService,
    private authService: AuthenticationService,
  ) {
    this.authService.authenticationState.subscribe((state) => {
      this.sessionData = state ? this.authService.getSessionData() : null;
    });
    this.user = this.sessionData.user
  }

  ngOnInit() {
    debugger;
    this.conceptOptions = this.restApi.getConceptsOptins();
  }

}
