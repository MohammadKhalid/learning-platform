import { Component, ViewChild, OnInit } from '@angular/core';
import { ShowTimeComponent } from '../../../components/show-time/show-time/show-time.component';

@Component({
  selector: 'app-show-time',
  templateUrl: './show-time.page.html',
  styleUrls: ['./show-time.page.scss'],
})
export class ShowTimePage implements OnInit {

	@ViewChild(ShowTimeComponent) componentProp;

	constructor() {}

	ngOnInit() {}
}