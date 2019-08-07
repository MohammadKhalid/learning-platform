import { Component, OnInit, Input } from '@angular/core';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { AuthenticationService } from 'src/app/services/user/authentication.service';
import { IMAGE_URL } from 'src/environments/environment';

@Component({
  selector: 'app-progress-complete-card',
  templateUrl: './progress-complete-card.component.html',
  styleUrls: ['./progress-complete-card.component.scss'],
})
export class ProgressCompleteCardComponent implements OnInit {
  @Input() tabType: any;
  user: any;
  incompleteCourses: any = []
  defaultImage: string = "assets/img/certification/default-course.jpg";
  serverUrl: string = `${IMAGE_URL}/certification/`;
  imageToShowOnError: string = "assets/img/certification/no-img.jpg";
  constructor(
    private restApi: RestApiService,
    private auth: AuthenticationService
  ) { }

  ngOnInit() {

    this.user = this.auth.getSessionData().user;
    if (this.tabType === 'inprogress') {
      this.restApi.get('course/uncomplete-course', { userId: this.user.id }).subscribe((resp: any) => {
        this.incompleteCourses = resp.data
      })
    }
    else if (this.tabType === 'completed') {
      // your api end point goes here.
      this.restApi.get('course/completed-courses', { userId: this.user.id }).subscribe((resp: any) => {
        this.incompleteCourses = resp.data
      })
    }
  }

}
