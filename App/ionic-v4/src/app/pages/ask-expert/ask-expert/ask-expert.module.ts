import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { IonicModule } from '@ionic/angular';

import { AskExpertPage } from './ask-expert.page';
//  import { ContactAddModalPageModule } from './contact-add-modal/contact-add-modal.module'; 
import { ContactAddModelComponent } from './contact-add-model/contact-add-model.component';
import { TimeformatPipe } from 'src/app/pipes/timeformat.pipe';
// import { FilterPipe } from 'src/app/pipes/filter.pipe';
import { TimeformatHhMmPipe } from 'src/app/pipes/timeformat-hh-mm.pipe';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TimeAgoPipe } from 'src/app/pipes/time-ago.pipe';
import { PipesModule } from 'src/app/pipes/pipes.module';
const config: SocketIoConfig = { url: 'http://localhost:6000', options: {} };

const routes: Routes = [
  {
    path: '',
    component: AskExpertPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InfiniteScrollModule,
    PipesModule,
    // ContactAddModalPageModule,
    //SocketIoModule.forRoot(config),


    RouterModule.forChild(routes)
  ],
  declarations: [AskExpertPage, ContactAddModelComponent, TimeformatPipe, TimeformatHhMmPipe,
    TimeAgoPipe],
  entryComponents: [ContactAddModelComponent],
})
export class AskExpertPageModule { }
