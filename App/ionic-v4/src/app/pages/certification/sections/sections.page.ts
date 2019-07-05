import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-sections',
  templateUrl: './sections.page.html',
  styleUrls: ['./sections.page.scss'],
})
export class SectionsPage implements OnInit {

  constructor(private menu :MenuController) { }
  public searchTerm: string = "";
  public items: any;
  public item: any = [
    { title: "one" },
      { title: "two" },
      { title: "three" },
      { title: "four" },
      { title: "five" },
      { title: "six" }
  ];
  ngOnInit() {
    this.menu.enable(false, 'mainMenu');
  }
back(){
  this.menu.enable(true,'mainMenu')
  console.log('working')
}
setFilteredItems() {
  this.items = this.item.filterItems(this.searchTerm);
}
}
