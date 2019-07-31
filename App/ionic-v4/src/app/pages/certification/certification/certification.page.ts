import { Component, OnInit } from '@angular/core';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { AuthenticationService } from 'src/app/services/user/authentication.service';

@Component({
  selector: 'app-certification',
  templateUrl: './certification.page.html',
  styleUrls: ['./certification.page.scss'],
})
export class CertificationPage implements OnInit {
  courses: any = [];
  user: any
  constructor(
    private restService: RestApiService,
    private authService: AuthenticationService,

  ) {

    this.user = this.authService.getSessionData().user;
  }

  ngOnInit() {
    let obj = {
      coachId: (this.user.type == 'coach')? this.user.id: this.user.createdBy,
      categories: [],
      searchBy: ''
    }
    if(this.user.type == 'coach'){
      this.searchByFilterEventCoach(obj)
    }else{
      this.searchByFilterEventStudent(obj)
    }
  }
  searchByFilterEventCoach(obj) {
    this.restService.get(`course/get-coaches-course`, obj).subscribe((resp: any) => {
      if (resp.data) this.courses = resp.data;
    });
  }
  
  searchByFilterEventStudent(obj) {
    debugger
    this.restService.get(`course`, obj).subscribe((resp: any) => {
      if (resp.data) this.courses = resp.data;
    });
  }
}
