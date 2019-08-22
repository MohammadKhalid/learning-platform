import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FileUploader, FileLikeObject } from 'ng2-file-upload';
import { NotificationService } from 'src/app/services/notification/notification.service';
@Component({
  selector: 'app-dropzone',
  templateUrl: './dropzone.component.html',
  styleUrls: ['./dropzone.component.scss'],
})
export class DropzoneComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({});
  @Output() eventBtnSubmit = new EventEmitter<number>();

  public hasBaseDropZoneOver: boolean = false;

  constructor(
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.eventBtnSubmit.next(0);

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log('FileUpload:uploaded:', item, status, response);
      this.notificationService.showMsg('File uploaded successfully');
    };
  }
  public onFileSelected(event: EventEmitter<File[]>) {
    this.eventBtnSubmit.next(this.uploader.queue.length);
  }
  getFiles(): FileLikeObject[] {
    return this.uploader.queue.map((fileItem) => {
      return fileItem.file;
    });
  }

  fileOverBase(ev): void {
    this.hasBaseDropZoneOver = ev;
  }

  removeFile(file) {
    this.uploader.removeFromQueue(file);
    this.onFileSelected(file);
  }

  removeAll() {
    this.uploader.clearQueue();
    this.eventBtnSubmit.next(0);
    // this.uploader = new FileUploader({});
  }
}
