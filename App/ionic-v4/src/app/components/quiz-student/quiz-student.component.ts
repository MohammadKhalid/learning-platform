import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { AuthenticationService } from 'src/app/services/user/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz-student',
  templateUrl: './quiz-student.component.html',
  styleUrls: ['./quiz-student.component.scss'],
})
export class QuizStudentComponent implements OnInit {
  @Output() QuizIndexEitter = new EventEmitter();

  // @Input() recordId: any;
  // @Input() sectionId: any;
  @Input() data: any;
  @Input() quizIndex: any;
  quizzesArray: any = []
  optionsCopy: any = []
  user: any
  attempted: Boolean = false;
  constructor(
    private restApi: RestApiService,
    private auth: AuthenticationService,
    private router: Router
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
  todo(value) {
    return value.map(x => {
      if (x.correctOption) {
        return x.text;
      }
    }).join(',')
  }
  // submitQuiz() {
  //   let obj = {
  //     studentId: this.user.id,
  //     title: this.recordId,
  //     sectionId: this.sectionId,
  //     finalQuiz: this.quizzesArray
  //   }

  //   this.restApi.postPromise('quiz/submit-quiz', obj)
  //     .then(response => {
  //       debugger;
  //       this.router.navigate([`certification/sections/concepts/${this.sectionId}/${this.recordId}/Quiz`])
  //     }).catch(error => {
  //       debugger;
  //     })
  // }

}
