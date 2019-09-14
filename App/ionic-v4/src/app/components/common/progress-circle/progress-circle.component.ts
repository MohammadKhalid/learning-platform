import { Component, OnInit } from '@angular/core';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { AuthenticationService } from 'src/app/services/user/authentication.service';

@Component({
  selector: 'app-progress-circle',
  templateUrl: './progress-circle.component.html',
  styleUrls: ['./progress-circle.component.scss'],
})
export class ProgressCircleComponent implements OnInit {

  constructor(private restapi : RestApiService,
    private auth : AuthenticationService) { }
user : any;
name : any;
level : any;
currentExp : any;
nextExp : any;
percent : any;
showXp : any;

  ngOnInit() {

    this.user = this.auth.getSessionData().user;
    this.restapi.getPromise('level/get-student-level',this.user.id).then(res=> {
      
      this.level ='LEVEL '+ res.data[0].currentLevel;
      this.currentExp=res.data[0].currentExperience;
      this.nextExp = res.data[0].nextExperience;
      this.name = res.data[0].student.name;
        this.percent = (this.currentExp/this.nextExp)*100 
        this.showXp = this.currentExp + ' XP/' + this.nextExp + ' XP'

       
      debugger;
    })  }

}
