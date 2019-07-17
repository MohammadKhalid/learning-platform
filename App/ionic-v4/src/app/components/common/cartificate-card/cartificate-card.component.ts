import { Component, OnInit, Input } from '@angular/core';
import { IMAGE_URL } from 'src/environments/environment';

@Component({
  selector: 'certificate-card',
  templateUrl: './cartificate-card.component.html',
  styleUrls: ['./cartificate-card.component.scss'],
})
export class CartificateCardComponent implements OnInit {
  private _scrollbarHidden: boolean;
  @Input() courses: any;
  data: any;
  defaultImage: string = "assets/img/certification/default-course.jpg";
  serverUrl: string = `${IMAGE_URL}/certification/`;
  imageToShowOnError: string = "assets/img/certification/no-img.jpg";
  constructor() { }
  ngOnInit() {
  }

}
