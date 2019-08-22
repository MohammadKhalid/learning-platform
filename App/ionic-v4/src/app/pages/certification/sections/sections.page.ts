import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { MenuController, NavController, IonInput, ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { Subscription, interval } from 'rxjs';
import { AuthenticationService } from 'src/app/services/user/authentication.service';
import { ConceptsPage } from './concepts/concepts.page';
import { DropzoneComponent } from 'src/app/components/common/dropzone/dropzone.component';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { AddModalComponent } from './concepts/add-modal/add-modal.component';
import { ResourceAddModelComponent } from './resource-add-model/resource-add-model.component';

@Component({
  selector: 'app-sections',
  templateUrl: './sections.page.html',
  styleUrls: ['./sections.page.scss'],
  providers: [ConceptsPage]
})

export class SectionsPage implements OnInit {
  @ViewChild(ConceptsPage) conceptView: ConceptsPage;
  @ViewChild(DropzoneComponent) fileField: DropzoneComponent;

  // @Output() myEventConcept = new EventEmitter();

  constructor(private menu: MenuController,
    private reouter: Router,
    private apiSrv: RestApiService,
    private actRoute: ActivatedRoute,
    private navCntrl: NavController,
    private authService: AuthenticationService,
    private notificationService: NotificationService,
    public modalcontroler: ModalController,
    private cdRef: ChangeDetectorRef) { }
  user: any;
  public searchTerm: string = "";
  private subscription: Subscription;
  private saveButtonSubscription: Subscription;
  private saveButtonResourceSubscription: Subscription;

  private subscriptionResource: Subscription;
  public items: any;
  listData: any = [];
  listResourceData: any = [];
  id: any
  isDeletedClicked: boolean = false;
  isDeletedClickedResource: boolean = false;
  isAddClicked: boolean = false
  files: any = [];

  // isAddClickedResource: boolean = false
  pageTitle = ''
  pageTitleResource = ''

  deleteId = 0
  lessonName: string;

  searchBy: string = "";
  panelOpenState = false;
  sectionId : any
  panelResourceOpenState = false;
  showField: boolean = false;
  // showFieldResource: boolean = false;
  isConcept: boolean = false;
  isResource: boolean = false;
  isResources: boolean = false;
  ngOnDestroy() {
    this.saveButtonSubscription.unsubscribe();
    this.saveButtonResourceSubscription.unsubscribe();
  }
  ngOnInit() {
    debugger
    this.sectionId = this.apiSrv.sectionId;
    this.searchBy = "";
    this.user = this.authService.getSessionData().user;
    //coach menu popupate start
    this.subscription = this.apiSrv.getSectionMenuData().subscribe(res => {
      if (res) {
        debugger
        res.concept ? this.listData = res.concept : '';
        res.resource ? this.listResourceData = res.resource : '';
        this.lessonName = res.title;
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

    //concept button start
    this.saveButtonSubscription = this.apiSrv.getSectionConceptSaveButton().subscribe(res => {
      if (res) {
        this.isConcept = true;
        this.cdRef.detectChanges();
      }
    });
    //concept button end

    //resource button start
    this.saveButtonResourceSubscription = this.apiSrv.getSectionResourceSaveButton().subscribe(res => {
      if (res) {
        this.isResource = true;
        this.cdRef.detectChanges();
      }
    });
    //resource button end
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
  recourcesroute(){
    this.reouter.navigate([`/certification/sections/resources/${this.apiSrv.sectionId}`])
  }

  // addSectionPageResource() {
  //   let obj = {
  //     title: this.pageTitle,
  //     sectionId: this.apiSrv.sectionId
  //   }
  //   this.apiSrv.postPromise('section-page', obj).then(respone => {
  //     this.listData.push(respone.data)
  //     this.showFieldResource = false
  //     this.pageTitleResource = ''
  //     this.isAddClickedResource = false
  //   }).catch(error => {

  //   })
  // }

  // eventBtnSubmit(count) {
  //   this.submitBtn = count > 0 ? false : true;
  // }
  deleteSectionPage(data) {
    this.deleteId = data.id
    this.apiSrv.delete(`section-page/${data.id}`).subscribe(response => {

      this.listData = this.listData.filter(x => x.id != data.id)
      this.isDeletedClicked = false
      this.deleteId = 0
    })
  }

  // upload() {
  //   this.files = this.fileField.getFiles();
  //   let formData = new FormData();
  //   this.files.forEach((file) => {
  //     formData.append('file', file.rawFile);
  //   });
  //   formData.append('sectionId', sectionId);
  //   this.apiSrv.postPromise('resource', formData)
  //     .then(res => {

  //       this.files = res.data;
  //       this.fileField.removeAll();

  //       this.apiSrv.populateSectionSubMenu(sectionId);

  //       this.notificationService.showMsg("Saved Successfully");
  //       this.reouter.navigate([`certification/sections/resources/${sectionId}`])
  //     }).catch(err => {
  //       this.notificationService.showMsg("Error inserting resources");
  //     })
  //   // // POST formData to Server
  // }
  deleteSectionPageResource(data) {
    this.deleteId = data.id
    this.apiSrv.delete(`resource/${data.id}`).subscribe(response => {
      this.listResourceData = this.listResourceData.filter(x => x.id != data.id)
      this.isDeletedClickedResource = false
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
    this.apiSrv.populateSectionConceptBackNavigate();
      let id = this.actRoute.snapshot.paramMap.get('id');
      // this.menu.enable(true, 'mainMenu')
    this.reouter.navigate([`/certification/module/${id}`])
  }

  goto(route) {
    this.reouter.navigate([`/certification/sections/${route}`])
  }

  gotoResourceType(data) {
    let sectionId = this.apiSrv.sectionId;
    this.reouter.navigate([`certification/sections/resources/${sectionId}/${data.id}`])
  }
  gotoConceptType(data) {
    let sectionId = this.apiSrv.sectionId;
    // if (data.type == "Quiz") {
    this.reouter.navigate([`certification/sections/concepts/${sectionId}/${data.id}`])
    // }
    // else if (data.type == "Resource") {
    //   this.reouter.navigate([`certification/sections/resources/${sectionId}/${data.title}`])
    // }
    // else {
    //   this.reouter.navigate([`certification/sections/concepts/${sectionId}/${data.id}`])
    // }
  }
  addConcept() {
    this.apiSrv.populateSectionConcept(true);
  }
  async popUpResource() {
    debugger;
    let sectionId = this.apiSrv.sectionId;

    const modal: HTMLIonModalElement =
      await this.modalcontroler.create({
        component: ResourceAddModelComponent,
        componentProps: {
          sectionId: sectionId,
          // updateList: this.updateList.bind(this)
        }
      });

    modal.onDidDismiss().then(() => {
    });
    await modal.present();
  }

}
