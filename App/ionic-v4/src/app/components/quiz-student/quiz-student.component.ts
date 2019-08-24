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
      quizAnswers: this.data.quizAnswers.length > 0 ? JSON.parse(this.data.quizAnswers[0].answer) : [],
      // studentOptions: JSON.parse(item.answer),
    })
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
  seprater(value) {
    return value.filter(x => x.correctOption).map(y => y.text).join(', ')
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
        let index = this.quizzesArray.findIndex(item => item.questionId === quizRow.questionId);
        let dumyArray = [];
        dumyArray.push({
          questionId: response.data[0].id,
          sectionPageId: response.data[0].sectionPageId,
          options: JSON.parse(response.data[0].options),
          question: response.data[0].question,
          quizAnswers: JSON.parse(response.data[0].quizAnswers[0].answer),
          // studentOptions: JSON.parse(item.answer),
        })

        this.quizzesArray.splice(index, 1, dumyArray[0]);

        this.notificationService.showMsg(response);
      }).catch(err => {
        debugger;
        this.notificationService.showMsg(err);
      })
  }
}
