import { Component, OnInit } from '@angular/core';
import { CategoryComponent } from '../category.component';

@Component({
  selector: 'app-student-category',
  templateUrl: './student-category.component.html',
  styleUrls: ['./student-category.component.scss'],
})
export class StudentCategoryComponent extends CategoryComponent implements OnInit {

  ngOnInit() {
    this.loadData();
  }

}