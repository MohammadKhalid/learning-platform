import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '../../../components/components.module';

import { UserShowTimePage } from './user-show-time.page';

const routes: Routes = [
  {
    path: '',
    component: UserShowTimePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    UserShowTimePage
  ]
})
export class UserShowTimePageModule {}
