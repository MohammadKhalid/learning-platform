import { Component, OnInit } from '@angular/core';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.page.html',
  styleUrls: ['./course-list.page.scss'],
})
export class CourseListPage implements OnInit {
    listdata: any = [];
  constructor(private restapi:RestApiService,
    private router : Router) { }
  add(){
    this.router.navigate(['/Course-Category/add'])
    alert('sd')
  }
  ngOnInit() {
    this.restapi.getPromise('course-category/get-all').then(res=> {
      
  this.listdata = res.data
    }).catch(err=> {

    })

  }
  editList(id){
      this.router.navigate([`/Course-Category/edit/${id}`])
  }

}
