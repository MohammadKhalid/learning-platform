import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './topic/topic.module#TopicPageModule' },

  { path: 'detail/:id', loadChildren: './topic-detail/topic-detail.module#TopicDetailPageModule' },
  { path: 'add', loadChildren: './topic-form/topic-form.module#TopicFormPageModule' },
  { path: 'edit/:id', loadChildren: './topic-form/topic-form.module#TopicFormPageModule' },

  { path: 'detail/:topic_id/challenge/add', loadChildren: '../question/question-form/question-form.module#QuestionFormPageModule' },
  { path: 'detail/:topic_id/challenge/edit/:id', loadChildren: '../question/question-form/question-form.module#QuestionFormPageModule' },
  { path: 'detail/:topic_id/challenge/detail/:id', loadChildren: '../question/question-detail/question-detail.module#QuestionDetailPageModule' }
];

@NgModule({
  declarations: [],
  imports: [
  	RouterModule.forChild(routes)
  ]
})
export class TopicRoutingModule { }
