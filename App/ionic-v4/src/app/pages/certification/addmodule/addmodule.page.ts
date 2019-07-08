import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-addmodule',
  templateUrl: './addmodule.page.html',
  styleUrls: ['./addmodule.page.scss'],
})
export class AddmodulePage implements OnInit {
  addModelbutton : boolean = true;
  moduleDetail : boolean = false;
  constructor(private router: Router) { }

  ngOnInit() {
  }

  loadmoduledetail() {
    this.addModelbutton = !this.addModelbutton;
    this.moduleDetail = !this.moduleDetail;
    // this.router.navigate(['/certification/moduledetail']);
  }

}
