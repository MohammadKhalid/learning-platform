import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit {

  addVideoForm: FormGroup

  constructor(
    private formBuilder: FormBuilder,
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
    
  }

}
