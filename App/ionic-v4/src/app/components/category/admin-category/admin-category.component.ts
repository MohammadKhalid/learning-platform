import { Component, OnInit } from '@angular/core';
import { CategoryComponent } from '../category.component';

@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.scss'],
})
export class AdminCategoryComponent extends CategoryComponent implements OnInit {

  ngOnInit() {
		super.loadData();
	}

}