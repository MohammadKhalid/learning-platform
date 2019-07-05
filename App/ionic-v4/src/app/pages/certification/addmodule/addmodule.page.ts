import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
@Component({
  selector: 'app-addmodule',
  templateUrl: './addmodule.page.html',
  styleUrls: ['./addmodule.page.scss'],
})
export class AddmodulePage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  loadmoduledetail() {
    this.router.navigate(['/certification/moduledetail']);
  }

}
