import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { forEach } from '@angular/router/src/utils/collection';
import { Router } from '@angular/router';
@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent implements OnInit {
  @Output() eventEmitterCloseModel = new EventEmitter<object>();
  spinner:boolean = false ;

  quizes: any = [];
  @Input() sectionPageId: any;
  @Input() sectionId: any;
  // @Input() quizTitle: any;
  btnTxt: string = 'Save'
  title: any;
  // oldTitle: string;
  isBtnDisable: boolean = true;

  constructor(
    private restApi: RestApiService,
    private notificationService: NotificationService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.quizes = [];
    this.isBtnDisable = true;

    // if (this.sectionId && this.quizTitle) {
    //   this.btnTxt = "Update";
    //   this.oldTitle = this.title = this.quizTitle;

    //   this.restApi.getPromise(`quiz/${this.sectionId}/${this.quizTitle}`).then(res => {
    //     for (const item of res.data) {
    //       let alterObj = {
    //         question: '',
    //         options: [
    //           { text: '', correctOption: false }
    //         ],
    //         experience: ''
    //       };
    //       alterObj.question = item.question;
    //       alterObj.options = JSON.parse(item.options);
    //       alterObj.experience = item.experience;

    //       this.quizes.push(alterObj);
    //     }

    //   }).catch(err => {
    //     this.notificationService.showMsg(`Server down ${err}.`);
    //   })
    // }
    // else {
      this.addQuestion();
    // }
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
      sectionPageId: this.sectionPageId,
      title: this.title,
      quizes: this.quizes,
      // oldTitle: this.oldTitle
    }
    this.restApi.postPromise('quiz', obj)
      .then(response => {
        this.router.navigate([`certification/sections/concepts/${this.restApi.courseid}/${this.sectionId}/${this.sectionPageId}`])
        this.spinner = true;
        this.notificationService.showMsg('Record Insert');
        this.eventEmitterCloseModel.next();
      }).catch(err => {
        this.notificationService.showMsg(err);
      })
  }
  // validate() {
  //   setTimeout(() => {
//     this.isBtnDisable = !this.isBtnDisable;
  //   }, 5000);
    
  // }
}