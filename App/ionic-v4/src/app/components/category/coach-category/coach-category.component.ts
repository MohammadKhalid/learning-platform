import { Component, OnInit } from '@angular/core';
import { CategoryComponent } from '../category.component';

@Component({
  selector: 'app-coach-category',
  templateUrl: './coach-category.component.html',
  styleUrls: ['./coach-category.component.scss'],
})
export class CoachCategoryComponent extends CategoryComponent implements OnInit {

  ngOnInit() {
    this.loadData();
  }

}
