import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { FormGroup, FormArray , FormControl, FormBuilder } from '@angular/forms';   


@Component({
  selector: 'app-addmodule',
  templateUrl: './addmodule.page.html',
  styleUrls: ['./addmodule.page.scss'],
})
export class AddmodulePage implements OnInit {
  addModelbutton : boolean = true;
  addDetail : FormGroup
  moduleDetail : boolean = false;
  
 
  constructor(private router: Router, private fb : FormBuilder) { }

  ngOnInit() {
  }

  loadmoduledetail() {
    this.addModelbutton = !this.addModelbutton;
    this.moduleDetail = !this.moduleDetail;
    // this.router.navigate(['/certification/moduledetail']);
  }
  

}
