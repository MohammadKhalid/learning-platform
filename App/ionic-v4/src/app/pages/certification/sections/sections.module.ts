import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { MatSidenavModule } from '@angular/material/sidenav';

import { SectionsPage } from './sections.page';
import { MatSelectModule } from '@angular/material';
import { OrderByDatePipe } from 'src/app/pipes/order-by-date.pipe';

const routes: Routes = [
  {
    path: '',
    component: SectionsPage,

    children: [
      { path: 'concepts/:id', loadChildren: './concepts/concepts.module#ConceptsPageModule' },
      { path: 'concepts/:id/:recordid/:type', loadChildren: './concepts/concepts.module#ConceptsPageModule' },
      { path: 'resources/:id', loadChildren: './resources/resources.module#ResourcesPageModule' },
      { path: 'resources/:id/:recordid/:type', loadChildren: './resources/resources.module#ResourcesPageModule' },
      // { path: 'resources/:id/:type', loadChildren: './resources/resources.module#ResourcesPageModule' },

      // { path: 'concepts/:type/:id', loadChildren: './concepts/concepts.module#ConceptsPageModule' },
      // { path: 'concepts', loadChildren: './concepts/concepts.module#ConceptsPageModule' },
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
  declarations: [SectionsPage, OrderByDatePipe]
})
export class SectionsPageModule {



}
