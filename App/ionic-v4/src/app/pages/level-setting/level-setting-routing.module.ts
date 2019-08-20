import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './level-list/level-list.module#LevelListPageModule' },
  { path: 'edit/:id', loadChildren: './level-setting.module#LevelSettingPageModule' },
  { path: 'add', loadChildren: './level-setting.module#LevelSettingPageModule' },
];
@NgModule({
  imports: [RouterModule.forChild(routes)]
  // exports: [RouterModule]
})
export class LevelSettingRoutingModule { }
