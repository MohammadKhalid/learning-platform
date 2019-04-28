import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'media-viewer/:id', loadChildren: './media-viewer/media-viewer.module#MediaViewerPageModule' },
  { path: 'media-viewer/:id', loadChildren: './media-viewer/media-viewer.module#MediaViewerPageModule' }
];

@NgModule({
  declarations: [],
  imports: [
  	RouterModule.forChild(routes)
  ]
})
export class PublicRoutingModule { }
