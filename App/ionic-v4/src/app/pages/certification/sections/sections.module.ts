import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import {MatSidenavModule} from '@angular/material/sidenav';

import { SectionsPage } from './sections.page';
import { ResourcesPage } from './resources/resources.page';
import { ConceptsPage } from './concepts/concepts.page';

const routes: Routes = [
  {
    path: '',
    component: SectionsPage,
    // children:[{
    //   path:'resources',
    //   component:ResourcesPage,
    // },
    //   {
    //     path: 'concepts',
    //     component:ConceptsPage,
       
    //   }
    // ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatSidenavModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SectionsPage,
  ResourcesPage,ConceptsPage]
})
export class SectionsPageModule {


 
}
