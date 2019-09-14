import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-add-edit-model',
  templateUrl: './add-edit-model.component.html',
  styleUrls: ['./add-edit-model.component.scss'],
})
export class AddEditModelComponent implements OnInit {
  addToList: any;
  updateList: any;
  currenttab: any;
  courseId: any = "";
  title: string = "";
  btnTxt: string = "";
  data: any;
  forms: FormGroup
  constructor(
    private navParams: NavParams,
    private fb: FormBuilder,
    public cntrl: ModalController,
    private service: RestApiService,
    private notifictation: NotificationService,
  ) {
    this.courseId = this.navParams.get("courseId");
    this.addToList = this.navParams.get("addToList");
    this.updateList = this.navParams.get("updateList");
    this.data = this.navParams.get("data");
  }
  ngOnInit() {
    this.title = "Add Module";
    this.btnTxt = "Save";
    this.forms = this.fb.group({
      title: new FormControl(''),
      description: new FormControl(''),
      totalExperience: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]*$')
      ])),
      courseId: this.courseId,
      id: ''
    })
    if (this.data) {
      this.forms.controls['title'].setValue(this.data.title);
      this.forms.controls['totalExperience'].setValue(this.data.totalExperience);
      this.forms.controls['description'].setValue(this.data.description);
      this.forms.controls['courseId'].setValue(this.data.courseId);
      this.forms.controls['id'].setValue(this.data.id);
      this.title = "Update Module";
      this.btnTxt = "Update";
    }
  }
  close() {
    this.cntrl.dismiss();
  }
  save() {
    this.addModule('close');
  }
  addModule(type?: string) {

    if (this.forms.controls.id.value) {
      this.service.putPromise(`section/${this.forms.controls.id.value}`, this.forms.value)
        .then(res => {
          this.notifictation.showMsg("Update Successfully");
          this.close();
          this.updateList(res);
        }).catch(err => {
          this.notifictation.showMsg("Error Updating Module");
        })
    }
    else {
      this.service.postPromise('section', this.forms.value).then(res => {
        if (type === "close") {
          this.close();
        }
        this.forms.reset();
        this.forms.controls['courseId'].setValue(this.courseId);
        this.addToList(res);
      }).catch(res => {
        this.notifictation.showMsg('Error to Add');
      })
    }
  }
  saveAndNext() {
    this.addModule();
  }
}
