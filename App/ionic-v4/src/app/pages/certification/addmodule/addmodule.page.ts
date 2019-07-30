import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormArray, FormControl, FormBuilder,Validators } from '@angular/forms';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { NotificationService } from 'src/app/services/notification/notification.service';


@Component({
  selector: 'app-addmodule',
  templateUrl: './addmodule.page.html',
  styleUrls: ['./addmodule.page.scss'],
})
export class AddmodulePage implements OnInit {
  addModelbutton: boolean = true;

  moduleDetail: boolean = false;
  id: any;

  constructor(private router: Router, 
    private fb: FormBuilder,
     private actroute: ActivatedRoute,
      private service: RestApiService,
      private notifictation : NotificationService) { }
  data: any;
  serverUrl: string = "./assets/img/";
  forms: FormGroup
  ngOnInit() {
    this.id = this.actroute.snapshot.paramMap.get('id');
    this.forms = this.fb.group({
      title: new FormControl(''),
      description: new FormControl(''),
      totalExperience: new FormControl('',Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]*$')
      ])),
      courseId: this.id
    })

    console.log(this.actroute.snapshot.paramMap.get('id'));

    this.service.getPromise('section/get-sections', this.id).then(res => {
      this.data = res.data;
      this.notifictation.showMsg('text added')
    }).catch(err => {
       
    })

  }
  
  Cancel(){
    this.addModelbutton = !this.addModelbutton;
    this.moduleDetail = !this.moduleDetail;
  }
  loadmoduledetail() {
    this.addModelbutton = !this.addModelbutton;
    this.moduleDetail = !this.moduleDetail;
    // this.router.navigate(['/certification/moduledetail']);
  }

  addModule() {
    this.service.postPromise('section', this.forms.value).then(res => {
     
      this.data.push(res.data);
      this.addModelbutton = !this.addModelbutton;
      this.moduleDetail = !this.moduleDetail
      this.notifictation.showMsg("Successfully Added");

    }).catch(res => {
          this.notifictation.showMsg('Error to Add ');
    })

  }


}
