import { Component, OnInit, Input } from '@angular/core';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { AuthenticationService } from 'src/app/services/user/authentication.service';

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
  constructor(
    private restApi: RestApiService,
    private auth: AuthenticationService
  ) { }
  ngOnInit() {
    this.user = this.auth.getSessionData().user
    this.restApi.getPromise(`quiz/${this.sectionId}/${this.recordId}`)
      .then(response => {
        for (const item of response.data) {
          this.quizzesArray.push({
            id: item.id,
            question: item.question,
            options: JSON.parse(item.options),
            experience: item.experience
          })
        }
      }).catch(error => {

      })
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

      }).catch(error => {

      })
  }

}
