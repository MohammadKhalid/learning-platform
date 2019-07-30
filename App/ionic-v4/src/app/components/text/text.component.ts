import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule, FormBuilder, FormControl, Validators } from '@angular/forms';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent implements OnInit {
  addTextForm : FormGroup
  title: any;
  description : any;
 id : any;
  constructor(private formValue : FormBuilder,
     private serviceApi : RestApiService,
     private actroute : ActivatedRoute,
     private noti : NotificationService,
      ) { }

  ngOnInit() {
this.id  = this.actroute.snapshot.paramMap.get('id');
    this.addTextForm = this.formValue.group({
      
     
      title :new FormControl('',Validators.required),
      description : new FormControl('',Validators.required),
      sectionId :this.id,
    })
  }

addText(){
  debugger;
   let id = this.actroute.snapshot.paramMap.get('id');
  this.serviceApi.postPromise('text', this.addTextForm).then(res=> {
     this.noti.showMsg('text Created');
  
     this.serviceApi.getPromise(`section/get-section-details`, id).then(resSec => {
      this.serviceApi.setSectionMenuData(resSec.data);
    })


  }).catch(err=>{
    this.noti.showMsg(err);

  })

  
}
}
