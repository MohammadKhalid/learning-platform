import { Component, OnInit, Input } from '@angular/core';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { AuthenticationService } from 'src/app/services/user/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz-student',
  templateUrl: './quiz-student.component.html',
  styleUrls: ['./quiz-student.component.scss'],
})
export class QuizStudentComponent implements OnInit {
  @Input() recordId: any;
  @Input() sectionId: any;

  quizzesArray: any = []
  optionsCopy: any = []
  user: any
  attempted: Boolean = false;
  constructor(
    private restApi: RestApiService,
    private auth: AuthenticationService,
    private router: Router
  ) { }
  ngOnInit() {
    this.user = this.auth.getSessionData().user
    this.restApi.getPromise(`quiz/${this.sectionId}/${this.recordId}`)
      .then(response => {
        debugger
        this.attempted = response.attempted
        if (this.attempted) {

          for (const item of response.data) {
            this.quizzesArray.push({
              id: item.id,
              questionId: item.question.id,
              correctOptions: JSON.parse(item.question.options),
              question: item.question.question,
              studentOptions: JSON.parse(item.answer),
            })
          }
          debugger;
        } else {
          for (const item of response.data) {
            this.quizzesArray.push({
              id: item.id,
              question: item.question,
              options: JSON.parse(item.options),
              experience: item.experience
            })
          }
        }
      }).catch(error => {

      })
  }
  todo(value) {
    return value.map(x => {
      if (x.correctOption) {
        return x.text;
      }
    }).join(',')
  }
  submitQuiz() {
    let obj = {
      studentId: this.user.id,
      title: this.recordId,
      sectionId: this.sectionId,
      finalQuiz: this.quizzesArray
    }

    this.restApi.postPromise('quiz/submit-quiz', obj)
      .then(response => {
        debugger;
        this.router.navigate([`certification/sections/concepts/${this.sectionId}/${this.recordId}/Quiz`])
      }).catch(error => {
        debugger;
      })
  }

}
