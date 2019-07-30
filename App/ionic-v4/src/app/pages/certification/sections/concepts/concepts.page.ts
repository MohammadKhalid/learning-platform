import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../../../../services/http/rest-api.service';
import { AuthenticationService } from '../../../../services/user/authentication.service';
import { ActivatedRoute } from '@angular/router';
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
    private actRoute: ActivatedRoute
  ) {
    this.authService.authenticationState.subscribe((state) => {
      this.sessionData = state ? this.authService.getSessionData() : null;
    });
    this.user = this.sessionData.user
  }

  ngOnInit() {
    let id = this.actRoute.snapshot.paramMap.get('id')
    this.restApi.getPromise(`section/get-section-details`, id).then(res => {
      this.restApi.setSectionMenuData(res.data);
    })
    this.conceptOptions = this.restApi.getConceptsOptins();
  }

}
