import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-video-student',
  templateUrl: './video-student.component.html',
  styleUrls: ['./video-student.component.scss'],
})
export class VideoStudentComponent implements OnInit {

  constructor(
    private restApi: RestApiService,
    private notificationService: NotificationService,
  ) { }
  @Input() recordId: any;
  youtubeKey: any;
  title: string = "";
  youtubeUrl: string = 'https://www.youtube.com/embed/';
  @Output() titleEvent = new EventEmitter<string>();

  ngOnInit() {
    this.getById(this.recordId);
  }

  getById(recordId) {
    this.restApi.getPromise(`lesson/get-lesson-by-id-for-student/${recordId}`).then(res => {
        if (res.data.url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=))([\w\-]{10,12})\b/)) {
        this.titleEvent.next(res.data.title);
        let videoKey = res.data.url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=))([\w\-]{10,12})\b/)[1];
        this.youtubeKey = `${this.youtubeUrl}${videoKey}?rel=0`;
      }
    }).catch(err => {
      this.notificationService.showMsg(`Server down ${err}.`);
    })
  }
}
