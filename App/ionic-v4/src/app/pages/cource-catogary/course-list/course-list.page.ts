import { Component, OnInit } from '@angular/core';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/user/authentication.service';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.page.html',
  styleUrls: ['./course-list.page.scss'],
})
export class CourseListPage implements OnInit {
    listdata: any = [];
    user : any;
  constructor(private restapi:RestApiService,
    private router : Router,
    private auth: AuthenticationService) { }
  add(){
    this.router.navigate(['/Course-Category/add'])
  }
  ngOnInit() {
    this.user = this.auth.getSessionData().user;
   
  }


  ionViewWillEnter(){
    this.listUpdate()
  }
  listUpdate(){
  if(this.user.type == 'admin'){
    this.restapi.getPromise('course-category/get-all').then(res=> {
      
      this.listdata = res.data
        }).catch(err=> {
    
        })
  }else {
    this.restapi.getPromise('course-category/get-all',this.user.id).then(res=> {
      debugger;
      this.listdata = res.data
    }).catch(err=> {

    })
  }
    
  }
  editList(id){
      this.router.navigate([`/Course-Category/edit/${id}`])
  }

}
