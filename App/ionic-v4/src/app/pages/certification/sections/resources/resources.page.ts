import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { AuthenticationService } from 'src/app/services/user/authentication.service';

@Component({
  selector: 'app-page-resources',
  templateUrl: './resources.page.html',
  styleUrls: ['./resources.page.scss'],
})
export class ResourcesPage implements OnInit {
  sectionId: any;
  recordId: any;
  user: any;
  sessionData: any;

  constructor(
    private menu: MenuController,
    private actRoute: ActivatedRoute,
    private restApi: RestApiService,
    private authService: AuthenticationService,

  ) {
    this.authService.authenticationState.subscribe((state) => {
      this.sessionData = state ? this.authService.getSessionData() : null;
    });
    this.user = this.sessionData.user;
  }

  ngOnInit() {
    this.menu.enable(false);
    let id = this.restApi.sectionId = this.sectionId = this.actRoute.snapshot.paramMap.get('sectionid');


    this.recordId = this.actRoute.snapshot.paramMap.get('recordid');
    let type = this.actRoute.snapshot.paramMap.get('type');
    debugger;
    if (this.user.type === 'coach') {
      this.restApi.populateSectionSubMenu(id);
    }
    else if (this.user.type === 'student') {
      this.restApi.populateSectionSubMenuStudent(id);
    }
  }

  ionViewWillEnter() {
    this.menu.enable(false, 'mainMenu')
  }
}
