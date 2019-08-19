import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { IMAGE_URL } from 'src/environments/environment';
import { DragScrollComponent } from 'ngx-drag-scroll';

@Component({
  selector: 'certificate-card',
  templateUrl: './cartificate-card.component.html',
  styleUrls: ['./cartificate-card.component.scss'],
})
export class CartificateCardComponent implements OnInit {
  @ViewChild('nav', { read: DragScrollComponent }) ds: DragScrollComponent;

  private _scrollbarHidden: boolean;
  leftBtn: boolean = false;
  rightBtn: boolean = false;
  @Input() courses: any = [];
  defaultImage: string = "assets/img/certification/default-course.jpg";
  serverUrl: string = `${IMAGE_URL}/certification/`;
  imageToShowOnError: string = "assets/img/certification/no-img.jpg";

  constructor() { }
  ngOnInit() {
  }
  moveLeft() {
    this.ds.moveLeft();
  }

  moveRight() {
    this.ds.moveRight();
  }
  indexChanged(index) {
    this.rightBtn = false;
    this.leftBtn = false; 
    if (index == 0) {
      this.leftBtn = true;
    }
    else if (index === this.courses.length - 1) {
      this.rightBtn = true;
    }
  }

}
