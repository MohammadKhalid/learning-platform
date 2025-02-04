import { Component, OnInit, OnDestroy } from '@angular/core';
import { RestApiService } from '../../../../services/http/rest-api.service';
import { AuthenticationService } from '../../../../services/user/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AddModalComponent } from './add-modal/add-modal.component';
import { QuizEditModalComponent } from 'src/app/components/quiz-edit-modal/quiz-edit-modal.component';
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
  sectionConceptData: any = [];
  titleEmiter: any;
  courseid: any;
  sectionPageCount = []
  nextSectionPageId: number
  nextSectionId: number
  showFinish: boolean = false
  showNext: boolean = true
  private subscription: Subscription;
  private subscriptionBackNavigate: Subscription;
  // quizIndex: number = 1;

  constructor(
    private restApi: RestApiService,
    private authService: AuthenticationService,
    private actRoute: ActivatedRoute,
    private menu: MenuController,
    public modalcontroler: ModalController,
    private router: Router

  ) {
    this.authService.authenticationState.subscribe((state) => {
      this.sessionData = state ? this.authService.getSessionData() : null;
    });
    this.user = this.sessionData.user
  }
  // ionViewWillEnter() {
  //   this.menu.enable(true, 'mainMenu')
  // }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscriptionBackNavigate.unsubscribe();
  }
  // QuizIndexEitter() {
  //   debugger;
  //   this.quizIndex++;
  // }

  removeItem(data) {
    this.sectionConceptData.splice(this.sectionConceptData.indexOf(data), 1)

  }

  ngOnInit() {
    // this.menu.enable(true);
    // this.menu.enable(true, 'mainMenu')
    // this.menu.enable(true, 'mainMenu')
    this.sectionId = this.sectionId = this.actRoute.snapshot.paramMap.get('sectionid');
    this.sectionPageId = this.actRoute.snapshot.paramMap.get('sectionpageid');
    this.courseid = this.actRoute.snapshot.paramMap.get('courseid');

    if (this.sectionPageId) {

      this.restApi.populateSectionConceptSaveButton();
    }
    this.restApi.sectionId = this.sectionId;
    this.restApi.courseid = this.courseid;
    if (this.user.type === 'coach') {
      this.restApi.populateSectionSubMenu(this.sectionId);
    }
    else if (this.user.type === 'student') {
      this.restApi.getPromise(`section-page/get-section-pages/${this.courseid}`).then(res => {
        let sectionIndex = res.section.findIndex(x => x.id == this.sectionId)
        let sectionSectionPage = res.sectionPage.filter(x => x.sectionId == this.sectionId)
        debugger
        let inn = sectionSectionPage.findIndex(x => x.id == this.sectionPageId)
        let sectionPageIndex = res.sectionPage.findIndex(x => x.id == this.sectionPageId)
        let sectionCount = res.section.length
        let sectionPageCount = res.sectionPage.length

        if (((sectionIndex + 1) == sectionCount) && ((sectionPageIndex + 1) == sectionPageCount)) {
          this.showFinish = true
        } else {
          if ((inn + 1) != sectionSectionPage.length) {
            this.nextSectionPageId = res.sectionPage[(sectionPageIndex + 1)].id
            this.nextSectionId = this.sectionId
            debugger
          } else {
            // this.showNext = false
            this.nextSectionPageId = res.sectionPage[(sectionPageIndex + 1)].id
            this.nextSectionId = res.sectionPage[(sectionPageIndex + 1)].sectionId
          }
        }
      })
      this.restApi.populateSectionSubMenuStudent(this.sectionId);
    }

    // this.restApi.getPromise(`section/get-section-details`, id).then(res => {
    //   this.restApi.setSectionMenuData(res.data);
    // })
    // this.conceptOptions = this.restApi.getConceptsOptins();
    if (this.sectionPageId) {
      this.fetchSectionItems()
    }

    this.subscription = this.restApi.getSectionConcept().subscribe(res => {
      if (res) {
        this.popUpConcept();
      }
    });

    this.subscriptionBackNavigate = this.restApi.getSectionConceptBackNavigate().subscribe(res => {

      if (res) {
        let id = this.actRoute.snapshot.paramMap.get('sectionid');
        this.router.navigate([`/certification/module/${id}`]);
      }
    });
  }
  goToNextPage() {
    this.restApi.postPromise('student-progress/update-student-progress', {
      courseId: this.courseid,
      sectionId: this.sectionId,
      sectionPageId: this.sectionPageId,
      userId: this.user.id
    }).then(res=>{

      this.restApi.postPromise('student-progress/update-student-progress', {
        courseId: this.courseid,
        sectionId: this.nextSectionId,
        sectionPageId: this.nextSectionPageId,
        userId: this.user.id
      })
    })
    this.router.navigate([`certification/sections/concepts/${this.courseid}/${this.nextSectionId}/${this.nextSectionPageId}`]);
  }
  fetchSectionItems() {
    this.restApi.getPromise(`section-page/get-section-items/${this.courseid}/${this.sectionId}/${this.sectionPageId}/${this.user.id}`)
      .then(response => {
        this.sectionConceptData = response.data
      }).catch(error => {

      })
  }
  titleEvent(title) {
    this.titleEmiter = title;
  }

  finishCourse() {
    let obj = {
      courseId: this.courseid,
      userId: this.user.id
    }
    this.restApi.putPromise('course/change-student-course-status', obj).then(res => {
      this.router.navigate([`/certification/`])
    })
  }
  async popUpConcept(data?: any) {
    const modal: HTMLIonModalElement =
      await this.modalcontroler.create({
        component: AddModalComponent,
        componentProps: {
          sectionPageId: this.sectionPageId,
          sectionId: this.sectionId,
          data: data,
          fetchSectionItems: this.fetchSectionItems.bind(this)

        }
      });

    modal.onDidDismiss().then(() => {
    });
    await modal.present();
  }

  editItem(data) {
    this.popUpConcept(data)
  }

  async openQuizEditModal(data?: any) {
    const modal: HTMLIonModalElement =
      await this.modalcontroler.create({
        component: QuizEditModalComponent,
        componentProps: {
          data: data,
          updateList: this.updateList.bind(this),
        }
      });

    modal.onDidDismiss().then(() => {
    });
    await modal.present();
  }

  updateList(res) {

    var index = this.sectionConceptData.findIndex(item => item.id === res.data.id && item.type == res.data.type);
    this.sectionConceptData.splice(index, 1, res.data);
  }
}
