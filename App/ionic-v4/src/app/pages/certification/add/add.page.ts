import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {
  toppings =[];
  files : string;
  file : string = "work";
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  constructor() { }
// @ViewChild('element') elment : ElementRef
  ngOnInit() {
  }
  onFileChanged(event) {
    this.files = event.target.files[0].name;
    console.log(this.files)
   
  }

  
}
