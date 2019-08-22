import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-quiz-edit-modal',
  templateUrl: './quiz-edit-modal.component.html',
  styleUrls: ['./quiz-edit-modal.component.scss'],
})
export class QuizEditModalComponent implements OnInit {

  data: any;
  updateList: any;
  constructor(
    public cntrl: ModalController,
    private service: RestApiService,
    private notifictation: NotificationService,
    private navParams: NavParams,
  ) {
    // this.courseId = this.navParams.get("courseId");
    // this.addToList = this.navParams.get("addToList");
    // this.updateList = this.navParams.get("updateList");
    this.data = this.navParams.get("data");
    this.updateList = this.navParams.get("updateList");

  }
  ngOnInit() {
    // let alterObj = {
    //   question: '',
    //   options: [
    //     { text: '', correctOption: false }
    //   ],
    //   experience: ''
    // };
    // alterObj.question = this.data.question;
    // alterObj.options = JSON.parse(this.data.options);
    // alterObj.experience = this.data.experience;
    // this.data.push(alterObj);
  }
  close() {
    this.cntrl.dismiss();
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
    debugger;
    // let obj = {
    //   id: this.id,
    //   // title: this.title,
    //   quizes: this.data,
    //   // oldTitle: this.oldTitle
    // }
    // this.restApi.postPromise('quiz', obj)
    //   .then(response => {
    //     this.router.navigate([`certification/sections/concepts/${this.sectionId}/${this.sectionPageId}`])
    //     this.notificationService.showMsg('Record Insert');
    //   }).catch(err => {
    //     this.notificationService.showMsg(err);
    //   })
  }
  saveAndNext() {
    // this.editModule();
  }

}
