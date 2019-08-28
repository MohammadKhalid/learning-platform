import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormArray, FormControl, FormBuilder, Validators } from '@angular/forms';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { AuthenticationService } from 'src/app/services/user/authentication.service';
import { ModalController, PopoverController, MenuController } from '@ionic/angular';
import { AddEditModelComponent } from './add-edit-model/add-edit-model.component';
import { AddEditPopoverComponent } from 'src/app/components/common/add-edit-popover/add-edit-popover.component';

@Component({
  selector: 'app-addmodule',
  templateUrl: './addmodule.page.html',
  styleUrls: ['./addmodule.page.scss'],
})
export class AddmodulePage implements OnInit {

  id: any = "";
  user: any;
  courseTitle: 'Course Name'
  isStart: boolean = false
  constructor(private router: Router,
    private fb: FormBuilder,
    private actroute: ActivatedRoute,
    private service: RestApiService,
    private authService: AuthenticationService,
    public modalcontroler: ModalController,
    private notifictation: NotificationService,
    public popoverController: PopoverController,
    public menu: MenuController) { }
  data: any[] = [];
  studentExperience: any = []
  serverUrl: string = "./assets/img/";
  forms: FormGroup
  inProgressData: any = {};
  interval: any;
  ngOnInit() {



    this.user = this.authService.getSessionData().user;
    this.id = this.actroute.snapshot.paramMap.get('id');
    // this.forms = this.fb.group({
    //   title: new FormControl(''),
    //   description: new FormControl(''),
    //   totalExperience: new FormControl('', Validators.compose([
    //     Validators.required,
    //     Validators.pattern('^[0-9]*$')
    //   ])),
    //   courseId: this.id
    // })
    this.inprogressSection();

  }
  ionViewWillEnter() {
    debugger;
    this.inprogressSection();

  }


  // this.menu.enable(true);
  // 


  getModules(data) {

    this.service.getPromise(`section/get-sections/${this.id}/${this.user.id}`).then(res => {
      if (res.flag == 'Section') {
        debugger
        this.data = res.data;
        this.studentExperience = res.studentExperience
        // if (!this.inProgressData) {
        // this.inProgressData = res.data.length > 0 ? res.data[0] : [];
        this.inProgressData = data
        // }
        this.courseTitle = res.data[0].course.title
      } else {
        this.courseTitle = res.data[0].title
      }
    }).catch(err => {
    })

  }
  goToRoute(id) {

    this.router.navigate([`/certification/sections/concepts/${this.id}/${id}`])
  }
  n(id, total, flag) {
    if (this.studentExperience.length > 0) {
      let textExp = this.studentExperience.filter(x => x.sectionId == id)
        .reduce((acc, val) => acc.totalTextExperience + val.totalTextExperience)
      let lessonExp = this.studentExperience.filter(x => x.sectionId == id)
        .reduce((acc, val) => acc.totalLessonExperience + val.totalLessonExperience)
      return ((textExp + lessonExp) / total) * 100
    } else {
      return 0
    }
  }
  startLesson(item) {
    let obj = {
      userId: this.user.id,
      courseId: this.id
    }
    debugger
    if (this.isStart) {
      this.service.postPromise('course/enroll-course', obj).then(res => {
        this.router.navigate([`certification/sections/concepts/${obj.courseId}/${item.Section.id}/${item.id}`])
      }).catch(res => {
        this.notifictation.showMsg('Error to Add ');
      })
    } else {
      this.router.navigate([`certification/sections/concepts/${obj.courseId}/${item.Section.id}/${item.id}`])
    }
  }
  addModule() {
    this.service.postPromise('section', this.forms.value).then(res => {
      this.data.push(res.data);
      this.notifictation.showMsg("Successfully Added");

    }).catch(res => {
      this.notifictation.showMsg('Error to Add ');
    })

  }
  async openModal(data?: any) {
    const modal: HTMLIonModalElement =
      await this.modalcontroler.create({
        component: AddEditModelComponent,
        componentProps: {
          courseId: this.id,
          addToList: this.addToList.bind(this),
          data: data,
          updateList: this.updateList.bind(this)
        }
      });

    modal.onDidDismiss().then(() => {
    });
    await modal.present();
  }
  addToList(res) {
    this.data.push(res.data);
    this.notifictation.showMsg("Successfully Added");
  }
  updateList(res) {
    var index = this.data.findIndex(item => item.id === res.data.id);
    this.data.splice(index, 1, res.data);
  }
  inprogressSection() {

    this.service.getPromise(`section/get-last-section-id/${this.user.id}/${this.id}`).then(res => {
      debugger
      if (res.data.length == 0) {
        this.isStart = true
      }
      // this.inProgressData = res.data[0];
      this.getModules(res.data[0])
    }).catch(err => {
    })

  }



  deleteModule(id) {
    this.service.delete(`courses/${id}`).subscribe(res => {
      if (res) {
        this.notifictation.showMsg("Successfully delete record");
      }
    }, error => {
      this.notifictation.showMsg(error);
    })
  }
  editModule(data) {
    this.openModal(data)
  }
  async addEditPopOver(ev: any, item: any) {
    const popover = await this.popoverController.create({
      component: AddEditPopoverComponent,
      componentProps: {
        delete: this.deleteModule.bind(this),
        edit: this.editModule.bind(this),
        item: item
      },
      event: ev,
      animated: true,
      showBackdrop: true,
    });
    return await popover.present();
  }

}
