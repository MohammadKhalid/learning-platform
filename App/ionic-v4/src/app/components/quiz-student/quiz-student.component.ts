import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { AuthenticationService } from 'src/app/services/user/authentication.service';
import { Router } from '@angular/router';
import { AddEditPopoverComponent } from '../common/add-edit-popover/add-edit-popover.component';
import { PopoverController } from '@ionic/angular';

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

  ) { }
  // ionViewDidEnter() {
  //   // this.QuizIndexEitter.next();
  // }
  ngOnInit() {

    this.user = this.auth.getSessionData().user;
    this.data
    debugger;
    this.attempted = this.user.type === "coach" ? true : false;
    //  for (const item of this.data) {
    this.quizzesArray.push({
      questionId: this.data.id,
      sectionPageId: this.data.sectionPageId,
      correctOptions: JSON.parse(this.data.options),
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
  
}
