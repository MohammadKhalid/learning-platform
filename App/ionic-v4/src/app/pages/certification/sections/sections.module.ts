import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { MatSidenavModule } from '@angular/material/sidenav';

import { SectionsPage } from './sections.page';
import { MatSelectModule } from '@angular/material';


const routes: Routes = [
  {
    path: '',
    component: SectionsPage,

    children: [
      { path: 'resources', loadChildren: './resources/resources.module#ResourcesPageModule' },
      { path: '', loadChildren: './concepts/concepts.module#ConceptsPageModule' },
      { path: 'concepts', loadChildren: './concepts/concepts.module#ConceptsPageModule' },
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatSelectModule,
    MatSidenavModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SectionsPage]
})
export class SectionsPageModule {



}
