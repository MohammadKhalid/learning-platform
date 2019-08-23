import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { IMAGE_URL } from 'src/environments/environment';


@Component({
  selector: 'app-student-resources',
  templateUrl: './student-resources.component.html',
  styleUrls: ['./student-resources.component.scss'],
})
export class StudentResourcesComponent implements OnInit {
  @Input() sectionId
  filename: any
  fileData: any = [];
  serverUrl: string = `${IMAGE_URL}/resources/`;

  constructor(private activateroute: ActivatedRoute, private restapi: RestApiService, private notification: NotificationService) { }

  ngOnInit() {
    if (this.sectionId)
      this.restapi.getPromise(`resource/get-resources-for-student/${this.sectionId}`).then(res => {
        this.fileData = res.data;
      }).catch(err => {
        this.notification.showMsg('server err')
      })
  }
}
