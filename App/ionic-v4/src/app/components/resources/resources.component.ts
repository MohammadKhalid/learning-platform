import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { DropzoneComponent } from '../common/dropzone/dropzone.component';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss'],
})
export class ResourcesComponent implements OnInit {
  @ViewChild(DropzoneComponent) fileField: DropzoneComponent;
  @Input() recordId;
  addResourcesForm: FormGroup;
  submitBtn: boolean = true;
  files: any = [];
  constructor(
    private restApi: RestApiService,
    private notificationService: NotificationService,
    private actRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    // alert(this.actroute.snapshot.paramMap.get('id'))
    //  this.actroute.snapshot.paramMap.get('type');

  }
  upload() {
    this.files = this.fileField.getFiles();
    console.log(this.files);
    let formData = new FormData();
    // let test = [];

    // formData.append('somekey', 'some value') // Add any other data you want to send
    this.files.forEach((file) => {
      formData.append('file', file.rawFile);
      // test.push(file.rawFile);
    });
    // formData.append('file', JSON.stringify(test));
    // debugger;
    // formData.append('file', this.files);
    formData.append('sectionId', this.actRoute.snapshot.paramMap.get('id'));

    // this.fileField.removeAll();

    this.restApi.postPromise('resource', formData)
      .then(res => {

        this.files = res.data;
        this.fileField.removeAll();
        this.notificationService.showMsg("Saved Successfully");
      }).catch(err => {
        this.notificationService.showMsg("Error inserting resources");
      })
    // // POST formData to Server
  }

  eventBtnSubmit(count) {
    this.submitBtn = count > 0 ? false : true;
  }
}

