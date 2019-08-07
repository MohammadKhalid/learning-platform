import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-video-student',
  templateUrl: './video-student.component.html',
  styleUrls: ['./video-student.component.scss'],
})
export class VideoStudentComponent implements OnInit {

  constructor() { }
  @Input() recordId: any;
  ngOnInit() {
    debugger;
    this.recordId;
  }

}
