import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { RestApiService } from 'src/app/services/http/rest-api.service';

@Component({
  selector: 'app-sections',
  templateUrl: './sections.page.html',
  styleUrls: ['./sections.page.scss'],
})
export class SectionsPage implements OnInit {
 
  constructor(private menu: MenuController, private reouter: Router, private apiSrv : RestApiService,private actRoute : ActivatedRoute) { }
  public searchTerm: string = "";
  public items: any;
  listData : any;
  id : any
  searchBy: string;
  public item: any = [
    { title: "one" },
    { title: "two" },
    { title: "three" },
    { title: "four" },
    { title: "five" },
    { title: "six" }
  ];



  ngOnInit() {
    this.id = this.actRoute.snapshot.paramMap.get('id')
    this.apiSrv.getPromise(`section/get-section-details`,this.id).then(res => {
      debugger;
      this.listData = res.data;

    })
  }
  back() {
    this.menu.enable(true, 'mainMenu')
  }
  setFilteredItems() {
    this.items = this.item.filterItems(this.searchTerm);
  }

  ionViewWillEnter() {
    this.menu.enable(false, 'mainMenu')

  }

  goto(route) {
    this.reouter.navigate([`/certification/sections/${route}`])
  }

}
