import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FileUploader, FileLikeObject } from 'ng2-file-upload';
@Component({
  selector: 'app-dropzone',
  templateUrl: './dropzone.component.html',
  styleUrls: ['./dropzone.component.scss'],
})
export class DropzoneComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({});
  @Output() eventBtnSubmit = new EventEmitter<number>();

  public hasBaseDropZoneOver: boolean = false;

  constructor() { }

  ngOnInit() { }
  getFiles(): FileLikeObject[] {
    return this.uploader.queue.map((fileItem) => {
      return fileItem.file;
    });
  }

  fileOverBase(ev): void {
    this.hasBaseDropZoneOver = ev;
    // this.uploader ? this.eventBtnSubmit.next(this.uploader.queue.length) : null;
  }

  // reorderFiles(reorderEvent: CustomEvent): void {
  //   let element = this.uploader.queue.splice(reorderEvent.detail.from, 1)[0];
  //   this.uploader.queue.splice(reorderEvent.detail.to, 0, element);
  // }
  removeFile(file) {
    this.uploader.removeFromQueue(file);
    // this.eventBtnSubmit.next(this.uploader.queue.length);

  }
}
