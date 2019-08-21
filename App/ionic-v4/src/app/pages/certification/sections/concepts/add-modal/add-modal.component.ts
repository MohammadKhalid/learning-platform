import { Component, OnInit, Input } from '@angular/core';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-modal',
  templateUrl: './add-modal.component.html',
  styleUrls: ['./add-modal.component.scss'],
})
export class AddModalComponent implements OnInit {
  selectedOption: any;
  conceptOptions: any;
  @Input() sectionPageId: any;
  @Input() sectionId: any;
  @Input() recordId: any; 
  constructor(
    private restApi: RestApiService,
    public cntrl: ModalController,

  ) { }

  ngOnInit() {
    this.conceptOptions = this.restApi.getConceptsOptins();
    
  }
  eventEmitterCloseModel(){
    debugger
    this.close()
    this.restApi.setSectionConceptUnsub();
  }
  close() {
    this.cntrl.dismiss();
  }

}
