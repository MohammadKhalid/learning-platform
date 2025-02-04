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
  isLastRecord: boolean = false
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
    if (this.user.type == 'coach') {

      this.service.getPromise(`section/get-sections/${this.id}/${this.user.id}`).then(res => {
        if (res.flag == 'Section') {
          this.data = res.data;
          this.studentExperience = res.studentExperience
          debugger
          this.courseTitle = res.data[0].course.title
        } else {
          this.courseTitle = res.data[0].title
        }
      }).catch(err => {
      })
    } else {

      this.inprogressSection();
    }

  }
  ionViewWillEnter() {
    if (this.user.type == 'coach') {

      this.service.getPromise(`section/get-sections/${this.id}/${this.user.id}`).then(res => {
        if (res.flag == 'Section') {
          this.data = res.data;
          this.studentExperience = res.studentExperience
          debugger
          this.courseTitle = res.data[0].course.title
        } else {
          this.courseTitle = res.data[0].title
        }
      }).catch(err => {
      })
    } else {

      this.inprogressSection();
    }

  }


  // this.menu.enable(true);
  // 


  getModules(data) {

    debugger
    this.service.getPromise(`section/get-sections/${this.id}/${this.user.id}`).then(res => {
      if (res.flag == 'Section') {
        this.data = res.data;
        this.studentExperience = res.studentExperience
        if (data.length == 0) {
          this.inProgressData = {
            "Section": {
              "id": res.data[0].id,
              "title": res.data[0].title,
              "description": res.data[0].description,
            }
          }

        } else {
          this.inProgressData = data[0]
        }
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
    debugger
    if (this.studentExperience.length > 0) {
      let textExp = this.studentExperience.filter(x => x.sectionId == id).map(x => x.totalTextExperience)
        .reduce((acc, val) => acc + val, 0)
      let lessonExp = this.studentExperience.filter(x => x.sectionId == id).map(x => x.totalLessonExperience)
        .reduce((acc, val) => acc + val, 0)
      let quizExp = this.studentExperience.filter(x => x.sectionId == id).map(x => x.totalQuizExperience)
        .reduce((acc, val) => acc + val, 0)

      return ((textExp + lessonExp + quizExp) / total) * 100
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
      if (this.isLastRecord) {
        this.router.navigate([`certification/sections/concepts/${obj.courseId}/${item.Section.id}/${item.id}`])
      } else {
        this.router.navigate([`certification/sections/concepts/${obj.courseId}/${item.Section.id}`])
      }
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
    modal.present();
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
      if (res.studentCourse.length == 0) {
        this.isStart = true
      }
      if (res.data.length > 0) {
        this.isLastRecord = true
      }
      // this.inProgressData = res.data[0];
      this.getModules(res.data)
    }).catch(err => {
    })

  }



  deleteModule(id) {
    this.service.delete(`/section/${id}`).subscribe(res => {
      if (res) {
        debugger;
        this.notifictation.showMsg("Successfully delete record");
        this.popoverController.dismiss();
      }
    }, error => {
      this.notifictation.showMsg(error);
    })
  }
  editModule(data) {
    this.openModal(data);
    this.popoverController.dismiss();

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
