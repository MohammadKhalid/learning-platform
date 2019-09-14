import { Component, OnInit } from '@angular/core';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/user/authentication.service';

@Component({
  selector: 'app-level-list',
  templateUrl: './level-list.page.html',
  styleUrls: ['./level-list.page.scss'],
})
export class LevelListPage implements OnInit {
  listdata: any = [];
  user: any
  constructor(private restapi: RestApiService,
    private auth : AuthenticationService,
    private router: Router) { }

  add() {
    this.router.navigate(['level-setting/add'])
  }
  ngOnInit() {
    this.user = this.auth.getSessionData().user

  }


  ionViewWillEnter() {
    this.updateList();
  }
  updateList() {
    if(this.user.type == 'admin'){
      this.restapi.getPromise('/levelSetting/get-all').then(res => {
        this.listdata = res.data
      }).catch(err => {
  
      })
    }else{
      this.restapi.getPromise(`/levelSetting/get-all/${this.user.id}`).then(res => {
        debugger
        this.listdata = res.data
      }).catch(err => {
  
      })
    }

  }
  editList(id) {
    this.router.navigate([`/level-setting/edit/${id}`])
  }


}
