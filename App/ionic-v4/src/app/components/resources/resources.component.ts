import { Component, OnInit, ViewChild } from '@angular/core';
import { DropzoneComponent } from '../common/dropzone/dropzone.component';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
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
  constructor() { }

  ngOnInit() {
  }
  upload() {
    debugger;
    this.files = this.fileField.getFiles();
    console.log(this.files);
    let formData = new FormData();
    // formData.append('somekey', 'some value') // Add any other data you want to send
    this.files.forEach((file) => {
      formData.append('files[]', file.rawFile, file.name);
    });
    // POST formData to Server
  }

  eventBtnSubmit(count) {
    debugger;
    this.submitBtn = count > 0 ? false : true;
  }
}

