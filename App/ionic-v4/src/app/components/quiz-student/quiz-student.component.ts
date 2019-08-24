import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { AuthenticationService } from 'src/app/services/user/authentication.service';
import { Router } from '@angular/router';
import { AddEditPopoverComponent } from '../common/add-edit-popover/add-edit-popover.component';
import { PopoverController } from '@ionic/angular';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-quiz-student',
  templateUrl: './quiz-student.component.html',
  styleUrls: ['./quiz-student.component.scss'],
})
export class QuizStudentComponent implements OnInit {
  @Output() QuizIndexEitter = new EventEmitter();
  @Output() removeItem = new EventEmitter<object>();
  @Output() openQuizEditModal = new EventEmitter<object>();

  @Input() data: any;
  @Input() quizIndex: any;
  quizzesArray: any = []
  optionsCopy: any = []
  user: any
  attempted: Boolean = false;
  isDeletedClicked: boolean = false
  constructor(
    private restApi: RestApiService,
    private auth: AuthenticationService,
    private router: Router,
    public popoverController: PopoverController,
    private notificationService: NotificationService,
  ) { }
  // ionViewDidEnter() {
  //   // this.QuizIndexEitter.next();
  // }
  ngOnInit() {

    this.user = this.auth.getSessionData().user;
    this.attempted = this.user.type === "coach" ? true : this.data.attempted;
    //  for (const item of this.data) {

    this.quizzesArray.push({
      questionId: this.data.id,
      sectionPageId: this.data.sectionPageId,
      options: JSON.parse(this.data.options),
      question: this.data.question,
      // studentOptions: JSON.parse(item.answer),
    })
    // }
    // this.restApi.getPromise(`quiz/${this.sectionId}/${this.recordId}`)
    //   .then(response => {
    //     debugger
    //     this.attempted = response.attempted
    //     if (this.attempted) {

    //       for (const item of response.data) {
    //         this.quizzesArray.push({
    //           id: item.id,
    //           questionId: item.question.id,
    //           correctOptions: JSON.parse(item.question.options),
    //           question: item.question.question,
    //           studentOptions: JSON.parse(item.answer),
    //         })
    //       }
    //       debugger;
    //     } else {
    //       for (const item of response.data) {
    //         this.quizzesArray.push({
    //           id: item.id,
    //           question: item.question,
    //           options: JSON.parse(item.options),
    //           experience: item.experience
    //         })
    //       }
    //     }
    //   }).catch(error => {

    //   })
  }

  deleteQuiz() {
    this.isDeletedClicked = true
    this.restApi.delete(`quiz/${this.data.id}`).subscribe(res => {
      this.isDeletedClicked = false
      this.removeItem.next(this.data)
    })
  }
  editQuiz() {
    this.openQuizEditModal.next(this.data)
  }
  todo(value) {
    return value.map(x => {
      if (x.correctOption) {
        return x.text;
      }
    }).join(',')
  }
  async addEditPopOver(ev: any, item: any) {
    const popover = await this.popoverController.create({
      component: AddEditPopoverComponent,
      componentProps: {
        delete: this.deleteQuiz.bind(this),
        edit: this.editQuiz.bind(this),
        item: item
      },
      event: ev,
      animated: true,
      showBackdrop: true,
    });
    return await popover.present();
  }
  submitQuiz(quizRow) {
    quizRow.userId = this.user.id;
    debugger;
    // this.attempted = true;
    this.restApi.postPromise('quiz/submit-quiz', quizRow)
      .then(response => {
        debugger;
        this.attempted = true;
       
        // this.quizzesArray.splice(this.quizzesArray.indexOf(quizRow), 1, quizRow);
        // let index = this.quizzesArray.findIndex(item => item.id === quizRow.id);
        // this.quizzesArray.splice(index, 1, response);

        this.notificationService.showMsg(response);
      }).catch(err => {
        debugger;
        this.notificationService.showMsg(err);
      })
  }
}
