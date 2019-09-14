import { Component, OnInit } from '@angular/core';
import { TopicComponent } from '../topic.component';

@Component({
  selector: 'app-student-topic',
  templateUrl: './student-topic.component.html',
  styleUrls: ['./student-topic.component.scss'],
})
export class StudentTopicComponent extends TopicComponent implements OnInit {

  ngOnInit() {
    this.loadData();
  }

}