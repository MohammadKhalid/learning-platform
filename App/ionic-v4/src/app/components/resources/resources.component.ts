import { Component, OnInit, ViewChild } from '@angular/core';
import { DropzoneComponent } from '../common/dropzone/dropzone.component';
@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss'],
})
export class ResourcesComponent implements OnInit {
  @ViewChild(DropzoneComponent) fileField: DropzoneComponent;

  constructor() { }

  ngOnInit() { }

  upload() {
    let files = this.fileField.getFiles();
    console.log(files);

    let formData = new FormData();
    formData.append('somekey', 'some value') // Add any other data you want to send

    files.forEach((file) => {
      formData.append('files[]', file.rawFile, file.name);
    });
    // POST formData to Server
  }
}

