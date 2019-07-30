import { Component, OnInit } from '@angular/core';
import { RestApiService } from 'src/app/services/http/rest-api.service';
@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent implements OnInit {
  quizes: any = [];

  constructor(
    private restApi: RestApiService,
  ) { }

  ngOnInit() {
    this.quizes = []
    this.addQuestion()
  }


  addOption(obj) {
    obj.push({ text: '', correctOption: false });
  }
  addQuestion() {
    this.quizes.push({
      question: '',
      options: [
        { text: '', correctOption: false }
      ],
      experience: ''
    });
  }

  deleteQuestion(index) {
    this.quizes.splice(index, 1);
  }

  saveQuestion() {
    let obj = {
      sectionId: 1,
      quizes: this.quizes
    }
    this.restApi.postPromise('quiz', obj)
      .then(response => {
        this.quizes = []
        this.addQuestion();
      }).catch(error => {

      })
  }
}