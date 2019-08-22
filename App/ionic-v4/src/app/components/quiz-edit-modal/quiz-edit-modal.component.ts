import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { NotificationService } from 'src/app/services/notification/notification.service';


@Component({
  selector: 'app-quiz-edit-modal',
  templateUrl: './quiz-edit-modal.component.html',
  styleUrls: ['./quiz-edit-modal.component.scss'],
})
export class QuizEditModalComponent implements OnInit {
  // @Output() eventEmitterCloseModel = new EventEmitter();

  title: any;
  data: any;
  id: any;

  quizes: any = [];
  updateList: any;
  constructor(
    public cntrl: ModalController,
    private service: RestApiService,
    private notifictation: NotificationService,
    private navParams: NavParams,
  ) {
    // this.courseId = this.navParams.get("courseId");
    // this.addToList = this.navParams.get("addToList"); 
    this.data = this.navParams.get("data");
    this.updateList = this.navParams.get("updateList");

  }
  ngOnInit() {

    let alterObj = {
      id: this.data.id,
      question: '',
      options: [
        { text: '', correctOption: false }
      ],
      experience: ''
    };
    alterObj.question = this.data.question;
    alterObj.options = JSON.parse(this.data.options);
    alterObj.experience = this.data.experience;
    this.quizes.push(alterObj)
  }
  close() {
    this.cntrl.dismiss();
  }

  addOption(obj) {
    obj.push({ text: '', correctOption: false });
  }
  save() {
    // this.editModule('close');
  }
  // editModule(type?: string) {
  //   // let obj = {
  //   //   id: this.id,
  //   //   // title: this.title,
  //   //   quizes: this.data,
  //   //   // oldTitle: this.oldTitle
  //   // }
  //   // this.updateList('res')

  //   // this.service.putPromise(`section/${this.forms.controls.id.value}`, this.forms.value)
  //   //   .then(res => {
  //   //     this.notifictation.showMsg("Update Successfully");
  //   //     this.close();
  //   //   }).catch(err => {
  //   //     this.notifictation.showMsg("Error Updating Module");
  //   //   }) 
  // }
  saveQuestion() {
    let obj = {
      type: 'Quiz',
      id: this.quizes[0].id,
      title: this.quizes[0].title,
      options: this.quizes[0].options,
      experience: this.quizes[0].experience,
      question: this.quizes[0].question
    }
    this.service.putPromise(`quiz/${obj.id}`, obj)
      .then(response => {
        this.notifictation.showMsg('Record Updated');
        debugger;
        let res = {
          data: obj
        }
        this.updateList(res);
      }).catch(err => {
        this.notifictation.showMsg(err);
      })
  }
  saveAndNext() {
    // this.editModule();
  }

}
