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
      title: new FormControl('', Validators.compose([
        Validators.required
      ])),
      categoryId: new FormControl('', Validators.compose([
        Validators.required
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
