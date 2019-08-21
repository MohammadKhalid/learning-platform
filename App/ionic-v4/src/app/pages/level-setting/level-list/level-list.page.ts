import { Component, OnInit } from '@angular/core';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-level-list',
  templateUrl: './level-list.page.html',
  styleUrls: ['./level-list.page.scss'],
})
export class LevelListPage implements OnInit {
  listdata: any = [];
  constructor(private restapi : RestApiService,
    private router : Router ) { }

  add(){
    this.router.navigate(['level-setting/add'])
  }
  ngOnInit() {
    
    this.restapi.getPromise('/levelSetting/get-all').then(res=> {
     debugger
      
  this.listdata = res.data
    }).catch(err=> {

    })

  }
  editList(id){
      this.router.navigate([`/level-setting/edit/${id}`])
  }


}
