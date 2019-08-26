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
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ConceptsPage } from './concepts/concepts.page';
import { ResourceAddModelComponent } from './resource-add-model/resource-add-model.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';

const routes: Routes = [
  {
    path: '',
    component: SectionsPage,

    children: [
      { path: 'concepts/:courseid/:sectionid', loadChildren: './concepts/concepts.module#ConceptsPageModule' },
      { path: 'concepts/:courseid/:sectionid/:sectionpageid', loadChildren: './concepts/concepts.module#ConceptsPageModule' },
      { path: 'resources/:courseid/:sectionid', loadChildren: './resources/resources.module#ResourcesPageModule' },
      { path: 'quizes-answer/:courseid/:sectionid/:sectionpageid', loadChildren: './quizes-awnser/quizes-awnser.module#QuizesAwnserPageModule' },

      // { path: 'resources/:sectionid/:sectionpageid', loadChildren: './resources/resources.module#ResourcesPageModule' },
      // { path: 'resources/:id/:type', loadChildren: './resources/resources.module#ResourcesPageModule' },

      // { path: 'concepts/:type/:id', loadChildren: './concepts/concepts.module#ConceptsPageModule' },
      // { path: 'concepts', loadChildren: './concepts/concepts.module#ConceptsPageModule' },
    ],
    runGuardsAndResolvers: 'always'
  }
];

@NgModule({
  imports: [
    ComponentsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    MatSelectModule,
    MatSidenavModule,
    MatExpansionModule,
    MatInputModule,
    PipesModule,
    DirectivesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SectionsPage, ResourceAddModelComponent],
  entryComponents: [ResourceAddModelComponent],

})
export class SectionsPageModule {



}
