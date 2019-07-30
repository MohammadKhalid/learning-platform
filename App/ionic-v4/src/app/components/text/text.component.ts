import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule, FormBuilder, FormControl, Validators } from '@angular/forms';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent implements OnInit {
  addTextForm : FormGroup
  textArea: any;
  textTitle : any;
 id : any;
  constructor(private formValue : FormBuilder,
     private serviceApi : RestApiService,
     private actroute : ActivatedRoute) { }

  ngOnInit() {
this.id  = this.actroute.snapshot.paramMap.get('id');
    this.addTextForm = this.formValue.group({
      
     
      title :new FormControl('',Validators.required),
      description : new FormControl('',Validators.required),
      sectionId :this.id,
    })
  }

addText(){
  this.serviceApi.post('text', this.addTextForm.value).subscribe(res=> {
    console.log(res);
    
  })
}
}
