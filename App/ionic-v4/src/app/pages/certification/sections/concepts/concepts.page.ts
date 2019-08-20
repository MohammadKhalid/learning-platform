import { Component, OnInit, OnDestroy } from '@angular/core';
import { RestApiService } from '../../../../services/http/rest-api.service';
import { AuthenticationService } from '../../../../services/user/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AddModalComponent } from './add-modal/add-modal.component';
@Component({
  selector: 'app-concepts',
  templateUrl: './concepts.page.html',
  styleUrls: ['./concepts.page.scss'],
})
export class ConceptsPage implements OnInit {


  conceptOptions = [];
  sessionData: any;
  user: any;
  selectedOption: any;
  sectionPageId: any;
  type: any;
  quizTitle: any;
  sectionId: any;
  titleEmiter: any;
  private subscription: Subscription;


  constructor(
    private restApi: RestApiService,
    private authService: AuthenticationService,
    private actRoute: ActivatedRoute,
    private menu: MenuController,
    public modalcontroler: ModalController,

  ) {
    this.authService.authenticationState.subscribe((state) => {
      this.sessionData = state ? this.authService.getSessionData() : null;
    });
    this.user = this.sessionData.user
  }
  ionViewWillEnter() {
    this.menu.enable(false, 'mainMenu')
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  ngOnInit() {
    this.menu.enable(false);
    let sectionId = this.sectionId = this.actRoute.snapshot.paramMap.get('sectionid');
    this.sectionPageId = this.actRoute.snapshot.paramMap.get('sectionpageid');
    if (this.sectionPageId) {
      this.restApi.populateSectionConceptSaveButton();
    }
    let type = this.type = this.actRoute.snapshot.paramMap.get('type');
    this.restApi.sectionId = sectionId;
    if (this.user.type === 'coach') {
      this.restApi.populateSectionSubMenu(sectionId);
    }
    else if (this.user.type === 'student') {
      this.restApi.populateSectionSubMenuStudent(sectionId);
    }

    // this.restApi.getPromise(`section/get-section-details`, id).then(res => {
    //   this.restApi.setSectionMenuData(res.data);
    // })
    // this.conceptOptions = this.restApi.getConceptsOptins();
    if (this.sectionPageId && type) {
      this.selectedOption = this.restApi.getConceptsOptionsByname(type);
    }

    this.subscription = this.restApi.getSectionConcept().subscribe(res => {
      if (res) {
        this.popUpConcept();
      }
    });
  }
  titleEvent(title) {
    this.titleEmiter = title;
  }
  async popUpConcept(data?: any) {
    const modal: HTMLIonModalElement =
      await this.modalcontroler.create({
        component: AddModalComponent,
        componentProps: {
          sectionPageId: this.sectionPageId,
          sectionId: this.sectionId,
          recordId: ''
          // data: data,
          // updateList: this.updateList.bind(this)
        }
      });

    modal.onDidDismiss().then(() => {
    });
    await modal.present();
  }
}
