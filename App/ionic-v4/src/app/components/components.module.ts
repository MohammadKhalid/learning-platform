import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { IonicSelectableModule } from 'ionic-selectable';
import { FileDropModule } from 'ngx-file-drop';
import { SimplePdfViewerModule } from 'simple-pdf-viewer';

import { MediaComponent } from './media/media.component';
import { ConferenceComponent } from './conference/conference.component';
import { ShowTimeComponent } from './show-time/show-time/show-time.component';
import { ShowTimeDetailComponent } from './show-time/show-time-detail/show-time-detail.component';
import { ChatBoxComponent } from './chat-box/chat-box.component';

import { ProfileComponent } from './profile/profile.component';
import { StudentProfileComponent } from './profile/student-profile/student-profile.component';
import { CoachProfileComponent } from './profile/coach-profile/coach-profile.component';
import { ClientProfileComponent } from './profile/client-profile/client-profile.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { StudentDashboardComponent } from './dashboard/student-dashboard/student-dashboard.component';
import { CoachDashboardComponent } from './dashboard/coach-dashboard/coach-dashboard.component';
import { ClientDashboardComponent } from './dashboard/client-dashboard/client-dashboard.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';

import { CategoryComponent } from './category/category.component';
import { AdminCategoryComponent } from './category/admin-category/admin-category.component';
import { AdminCategoryFormComponent } from './category/admin-category-form/admin-category-form.component';
import { ClientCategoryComponent } from './category/client-category/client-category.component';
import { ClientCategoryFormComponent } from './category/client-category-form/client-category-form.component';
import { CoachCategoryComponent } from './category/coach-category/coach-category.component';
import { StudentCategoryComponent } from './category/student-category/student-category.component';

import { TopicComponent } from './topic/topic.component';
import { AdminTopicComponent } from './topic/admin-topic/admin-topic.component';
import { AdminTopicFormComponent } from './topic/admin-topic-form/admin-topic-form.component';
import { ClientTopicComponent } from './topic/client-topic/client-topic.component';
import { ClientTopicFormComponent } from './topic/client-topic-form/client-topic-form.component';
import { CoachTopicComponent } from './topic/coach-topic/coach-topic.component';
import { StudentTopicComponent } from './topic/student-topic/student-topic.component';

import { ClientTagModalComponent } from './modal/client-tag-modal/client-tag-modal.component';

import { MatTabsModule } from '@angular/material/tabs';
import { ErrorsComponent } from './errors/errors.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		IonicModule,
		IonicSelectableModule,
		FileDropModule,
		SimplePdfViewerModule,
		RouterModule,
		MatTabsModule
	],
	declarations: [
		ErrorsComponent,
		MediaComponent,
		ConferenceComponent,
		ShowTimeComponent,
		ShowTimeDetailComponent,
		ChatBoxComponent,
		ProfileComponent,
		StudentProfileComponent,
		CoachProfileComponent,
		ClientProfileComponent,
		DashboardComponent,
		StudentDashboardComponent,
		CoachDashboardComponent,
		CoachDashboardComponent,
		ClientDashboardComponent,
		AdminDashboardComponent,
		CategoryComponent,
		AdminCategoryComponent,
		AdminCategoryFormComponent,
		ClientCategoryComponent,
		ClientCategoryFormComponent,
		CoachCategoryComponent,
		StudentCategoryComponent,
		TopicComponent,
		AdminTopicComponent,
		AdminTopicFormComponent,
		ClientTopicComponent,
		ClientTopicFormComponent,
		CoachTopicComponent,
		StudentTopicComponent,
		ClientTagModalComponent
	],
	entryComponents: [
		MediaComponent,
		ClientTagModalComponent
	],
	exports: [
		ConferenceComponent,
		ShowTimeComponent,
		ShowTimeDetailComponent,
		ChatBoxComponent,
		ProfileComponent,
		StudentProfileComponent,
		CoachProfileComponent,
		ClientProfileComponent,
		DashboardComponent,
		StudentDashboardComponent,
		CoachDashboardComponent,
		CoachDashboardComponent,
		ClientDashboardComponent,
		AdminDashboardComponent,
		CategoryComponent,
		AdminCategoryComponent,
		AdminCategoryFormComponent,
		ClientCategoryComponent,
		ClientCategoryFormComponent,
		CoachCategoryComponent,
		StudentCategoryComponent,
		TopicComponent,
		AdminTopicComponent,
		AdminTopicFormComponent,
		ClientTopicComponent,
		ClientTopicFormComponent,
		CoachTopicComponent,
		StudentTopicComponent
	],
	providers: [
		ProfileComponent
	]
})
export class ComponentsModule {}