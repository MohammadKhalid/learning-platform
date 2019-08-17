import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MenuController, NavController, IonInput } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { Subscription, interval } from 'rxjs';
import { AuthenticationService } from 'src/app/services/user/authentication.service';

@Component({
  selector: 'app-sections',
  templateUrl: './sections.page.html',
  styleUrls: ['./sections.page.scss'],
})
export class SectionsPage implements OnInit {

  constructor(private menu: MenuController,
    private reouter: Router,
    private apiSrv: RestApiService,
    private actRoute: ActivatedRoute,
    private navCntrl: NavController,
    private authService: AuthenticationService) { }
  user: any;
  public searchTerm: string = "";
  private subscription: Subscription;
  private subscriptionResource: Subscription;
  public items: any;
  listData: any = [];
  listResourceData: any = [];
  id: any
  isDeletedClicked: boolean = false
  isAddClicked: boolean = false
  pageTitle = ''
  deleteId = 0

  searchBy: string = "";
  panelOpenState = false;
  panelResourceOpenState = false;
  showField: boolean = false;

  ngOnInit() {
    this.searchBy = "";
    this.user = this.authService.getSessionData().user;
    //coach menu popupate start
    this.subscription = this.apiSrv.getSectionMenuData().subscribe(res => {
      if (res) {
        res.concept ? this.listData = res.concept : '';
        res.resource ? this.listResourceData = res.resource : '';
      }
    });
    //coach menu popupate end

    //student menu popupate start
    this.subscription = this.apiSrv.getSectionMenuDataStudent().subscribe(res => {
      if (res) {
        res.concept ? this.listData = res.concept : '';
        res.resource ? this.listResourceData = res.resource : '';
      }
    });
    //student menu popupate end
  }

  addSectionPage() {
    let obj = {
      title: this.pageTitle,
      sectionId: this.apiSrv.sectionId
    }
    this.apiSrv.postPromise('section-page', obj).then(respone => {
      this.listData.push(respone.data)
      this.showField = false
      this.pageTitle = ''
      this.isAddClicked = false
    }).catch(error => {

    })
  }

  deleteSectionPage(data) {
    this.deleteId = data.id
    this.apiSrv.delete(`section-page/${data.id}`).subscribe(response => {
      this.listData = this.listData.filter(x => x.id != data.id)
      this.isDeletedClicked = false
      this.deleteId = 0
    })
  }

  ngAfterViewInit() {
    setInterval(() => {
      this.menu.enable(false);
      this.menu.enable(false, 'mainMenu')
    }, 100)
  }
  back() {
    this.menu.enable(true, 'mainMenu')
  }

  goto(route) {
    this.reouter.navigate([`/certification/sections/${route}`])
  }

  goToResource() {
    this.reouter.navigate([`/certification/sections/resources/${this.apiSrv.sectionId}`])
  }
  gotoConceptType(data) {
    let sectionId = this.apiSrv.sectionId;
    if (data.type == "Quiz") {
      this.reouter.navigate([`certification/sections/concepts/${sectionId}/${data.title}/${data.type}`])
    }
    else if (data.type == "Resource") {
      this.reouter.navigate([`certification/sections/resources/${sectionId}/${data.title}/${data.type}`])
    }
    else {
      this.reouter.navigate([`certification/sections/concepts/${sectionId}/${data.id}/${data.type}`])
    }
  }

}
