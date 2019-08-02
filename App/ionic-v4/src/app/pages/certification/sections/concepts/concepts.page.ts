import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../../../../services/http/rest-api.service';
import { AuthenticationService } from '../../../../services/user/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { MenuController } from '@ionic/angular';
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
  recordId: any;
  quizTitle: any;
  sectionId: any;

  constructor(
    private restApi: RestApiService,
    private authService: AuthenticationService,
    private actRoute: ActivatedRoute,
    private menu: MenuController
  ) {
    this.authService.authenticationState.subscribe((state) => {
      this.sessionData = state ? this.authService.getSessionData() : null;
    });
    this.user = this.sessionData.user
  }

  ngOnInit() {
    debugger;
    this.menu.enable(false);
    let id = this.sectionId = this.actRoute.snapshot.paramMap.get('id');
    this.recordId = this.actRoute.snapshot.paramMap.get('recordid');
    let type = this.actRoute.snapshot.paramMap.get('type');
    this.restApi.sectionId = id;
    this.restApi.getPromise(`section/get-section-details`, id).then(res => {
      this.restApi.setSectionMenuData(res.data);
    })
    this.conceptOptions = this.restApi.getConceptsOptins();
    if (this.recordId && type) {
      this.selectedOption = this.restApi.getConceptsOptionsByname(type);
    }
  }
}
