import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../../services/http/rest-api.service';

@Component({
  selector: 'app-level-settings',
  templateUrl: './level-settings.page.html',
  styleUrls: ['./level-settings.page.scss'],
})
export class LevelSettingsPage implements OnInit {

  initialLevel: string = '';
  initialExperience: string = '';
  baseUrl: string;

  constructor(private restApi: RestApiService) {
    this.baseUrl = this.restApi.url;
  }

  ngOnInit() {
  }

  saveSettings() {
    let obj = {
      initialLevel: this.initialLevel,
      initialExperience: this.initialExperience,
      adminId: "b5a8abb3-ec1a-4abe-bd07-681da590c0c5"
    }

    this.restApi.post('studentExperienceSettings', obj, {}).subscribe((res: any) => {
      if (res.success === true) {
        console.log(res);
      } else {
        console.log(res);
      }
    });
  }
}
