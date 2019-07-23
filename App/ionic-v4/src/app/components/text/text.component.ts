import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule, FormBuilder, FormControl, Validators } from '@angular/forms';
import { RestApiService } from 'src/app/services/http/rest-api.service';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent implements OnInit {
  addTextForm : FormGroup
  textArea: any;
  textTitle : any;
  constructor(private formValue : FormBuilder, private serviceApi : RestApiService) { }

  ngOnInit() {
    this.addTextForm = this.formValue.group({
      textArea :new FormControl('',Validators.required),
      textTitle : new FormControl('',Validators.required)
    })
  }

addText(){
  this.serviceApi.post('coach', this.addTextForm.value).subscribe(res=> {
    console.log(res);
    
  })
}
}
