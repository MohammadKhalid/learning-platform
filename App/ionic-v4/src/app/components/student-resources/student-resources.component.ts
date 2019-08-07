import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { NotificationService } from 'src/app/services/notification/notification.service';


@Component({
  selector: 'app-student-resources',
  templateUrl: './student-resources.component.html',
  styleUrls: ['./student-resources.component.scss'],
})
export class StudentResourcesComponent implements OnInit {
  @Input() sectionId
  @Input() title
  filename : any

  constructor(private activateroute: ActivatedRoute, private restapi: RestApiService,private notification: NotificationService) { }

  ngOnInit() {
    debugger;
    if (this.sectionId && this.title)
      this.restapi.getPromise(`get-resources-for-student/${this.sectionId}/${this.title}`).then(res => {
        this.filename = res.data;
     this.notification.showMsg('Successfully Done ')
      }).catch(err=>{
        this.notification.showMsg('server err')
      })
  }
}
