import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-student-text',
  templateUrl: './student-text.component.html',
  styleUrls: ['./student-text.component.scss'],
})
export class StudentTextComponent implements OnInit {
  @Input() sectionId: any;
  @Input() recordId: any;

  constructor(private activateroute : ActivatedRoute) { }

  ngOnInit() {
    let id = this.activateroute.snapshot.paramMap.get('id');
    this.sectionId = id;
  }
   
}
