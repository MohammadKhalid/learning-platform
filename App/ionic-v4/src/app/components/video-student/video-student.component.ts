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
  @Input() data: any;
  youtubeKey: any;
  title: string = "";
  youtubeUrl: string = 'https://www.youtube.com/embed/';

  ngOnInit() {
    this.getById(this.data);
    this.title= this.data.title;
  }

  getById(data) {

    if (data.url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=))([\w\-]{10,12})\b/)) {
      let videoKey = data.url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=))([\w\-]{10,12})\b/)[1];
      this.youtubeKey = `${this.youtubeUrl}${videoKey}?rel=0`;
    }
  }
}