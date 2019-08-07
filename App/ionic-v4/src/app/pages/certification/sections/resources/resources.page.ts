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
  constructor(
    private menu: MenuController,
    private actRoute: ActivatedRoute,
    private restApi: RestApiService,
    private authService: AuthenticationService,

  ) { }

  ngOnInit() {
    this.user =this.authService.getSessionData().user; 
    debugger;
    this.menu.enable(false);
    let id = this.sectionId = this.actRoute.snapshot.paramMap.get('id');
    this.recordId = this.actRoute.snapshot.paramMap.get('recordid');
    let type = this.actRoute.snapshot.paramMap.get('type');
    
    this.restApi.populateSectionSubMenu(id);
    this.restApi.populateSectionSubMenuResource(id);
  }

  ionViewWillEnter() {
    this.menu.enable(false, 'mainMenu')
  }
}
