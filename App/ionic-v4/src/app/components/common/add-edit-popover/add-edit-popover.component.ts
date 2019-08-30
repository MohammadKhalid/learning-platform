import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { ViewController } from '@ionic/core';

@Component({
  selector: 'app-add-edit-popover',
  templateUrl: './add-edit-popover.component.html',
  styleUrls: ['./add-edit-popover.component.scss'],
})
export class AddEditPopoverComponent implements OnInit {
  delete: any;
  edit: any;
  item: any;
  constructor(
    private navParams: NavParams,
    private modal : ModalController
  ) {
    this.delete = this.navParams.get("delete");
    this.edit = this.navParams.get("edit");
    this.item = this.navParams.get("item");

  }
spinner :boolean = false ;
  ngOnInit() { 
  }
  deleteRec() {
    this.delete(this.item.id);
 
  }
  editRec(){
    this.edit(this.item);
   
  }
}
