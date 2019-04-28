import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RestApiService } from '../../../services/http/rest-api.service';

@Component({
  selector: 'app-user-show-time',
  templateUrl: './user-show-time.page.html',
  styleUrls: ['./user-show-time.page.scss'],
})
export class UserShowTimePage implements OnInit {
  
  defaultUrl: string;
  routeData: any;
  item: any;
  queryParams: any = {};

  constructor(
    private restApi: RestApiService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe((routeData) => {
      this.routeData = routeData;

      this.activatedRoute.params.subscribe((paramData) => {
        this.defaultUrl = this.routeData.appUrl + '/detail/' + paramData.id;

        // get user info
        this.restApi.get(this.routeData.apiEndPoint + '/' + paramData.id).then((res: any) => {
          if(res.success === true) {
            const item = res.item;

            if(item.type === 'student') this.queryParams.userId = item.id;
            else if(item.type === 'coach') this.queryParams.submittedTo = item.id;

            this.item = item;
          }
        });
			});
		});
  }

}