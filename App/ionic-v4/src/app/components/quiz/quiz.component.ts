import { Component, OnInit, Input } from '@angular/core';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { forEach } from '@angular/router/src/utils/collection';
@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent implements OnInit {
  quizes: any = [];
  @Input() sectionId: any;
  btnTxt: string = 'Save'


  constructor(
    private restApi: RestApiService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.quizes = []
    this.addQuestion();
    if (this.sectionId) {
      this.btnTxt = "update"
      this.restApi.getPromise('quiz', this.sectionId).then(res => {
        debugger;
        this.quizes = res.data
        res.data.forEach(el => {

        });
      }).catch(err => {
        this.notificationService.showMsg(`Server down ${err}.`);
      })
    }
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