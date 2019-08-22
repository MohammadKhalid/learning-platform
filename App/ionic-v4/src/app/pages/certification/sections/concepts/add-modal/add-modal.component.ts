import { Component, OnInit, Input } from '@angular/core';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-add-modal',
  templateUrl: './add-modal.component.html',
  styleUrls: ['./add-modal.component.scss'],
})
export class AddModalComponent implements OnInit {
  selectedOption: any;
  conceptOptions: any;
  fetchSectionItems: any
  data: any;
  constructor(
    private restApi: RestApiService,
    public cntrl: ModalController,
    public navParam: NavParams
  ) {
    this.data = this.navParam.get('data')
    this.fetchSectionItems = this.navParam.get('fetchSectionItems')
  }

  ngOnInit() {
    if (this.data) {
      this.selectedOption = this.restApi.getConceptsOptionsByname(this.data.type)
    }
    this.conceptOptions = this.restApi.getConceptsOptins();

  }
  eventEmitterCloseModel() {
    this.close()
    this.fetchSectionItems()
    this.restApi.setSectionConceptUnsub();
  }
  close() {
    this.cntrl.dismiss();
  }

}
