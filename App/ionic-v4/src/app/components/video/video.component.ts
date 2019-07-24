import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { RestApiService } from 'src/app/services/http/rest-api.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit {

  addVideoForm: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private apiservice : RestApiService
  ) { }

  initForm() {
    this.addVideoForm = this.formBuilder.group({
      url: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$')
      ])),
      experience: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]*$')
      ])),
      description: new FormControl(''),
    });
  }
  ngOnInit() {
    this.initForm()
  }

  addVideo(){
    this.apiservice.post('video', this.addVideoForm.valid).subscribe(res => {
      console.log(res);
    })
    
    
  }

}
