import { Component, OnInit, ViewChild } from '@angular/core';
import { DropzoneComponent } from '../common/dropzone/dropzone.component';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss'],
})
export class ResourcesComponent implements OnInit {
  @ViewChild(DropzoneComponent) fileField: DropzoneComponent;
  addResourcesForm: FormGroup;
  submitBtn: boolean = true;
  files: any = [];
  constructor(
    private restApi: RestApiService,
    private notificationService: NotificationService,

  ) { }

  ngOnInit() {
  }
  upload() {
    this.files = this.fileField.getFiles();
    console.log(this.files);
    let formData = new FormData();
    // formData.append('somekey', 'some value') // Add any other data you want to send
    this.files.forEach((file) => {
      formData.append('files[]', file.rawFile, file.name);
    });
    this.fileField.removeAll();

    // this.restApi.postPromise('', formData)
    //   .then(res => {
    //     this.fileField.removeAll();
    //     this.notificationService.showMsg("Saved Successfully");
    //   }).catch(err => {
    //     this.notificationService.showMsg("Error inserting resources");
    //   })
    // // POST formData to Server
  }

  eventBtnSubmit(count) {
    this.submitBtn = count > 0 ? false : true;
  }
}

