import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { MatSidenavModule } from '@angular/material/sidenav';

import { SectionsPage } from './sections.page';
import { MatSelectModule, MatAutocompleteModule, MatBadgeModule, MatBottomSheetModule, MatButtonModule, MatButtonToggleModule, MatCardModule, MatChipsModule, MatCheckboxModule, MatDatepickerModule, MatStepperModule, MatDialogModule, MatExpansionModule, MatIconModule, MatInputModule, MatListModule, MatDividerModule, MatGridListModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule, MatRippleModule, MatSliderModule, MatSlideToggleModule, MatSnackBarModule, MatSortModule, MatTableModule, MatTabsModule, MatToolbarModule, MatTreeModule, MatTooltipModule } from '@angular/material';
import { OrderByDatePipe } from 'src/app/pipes/order-by-date.pipe';
import { A11yModule } from '@angular/cdk/a11y';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { PortalModule } from '@angular/cdk/portal';

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
    MatExpansionModule,
    MatInputModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SectionsPage, OrderByDatePipe]
})
export class SectionsPageModule {



}
