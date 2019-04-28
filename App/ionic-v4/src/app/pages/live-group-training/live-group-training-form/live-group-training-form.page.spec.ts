import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveGroupTrainingFormPage } from './live-group-training-form.page';

describe('LiveGroupTrainingFormPage', () => {
  let component: LiveGroupTrainingFormPage;
  let fixture: ComponentFixture<LiveGroupTrainingFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveGroupTrainingFormPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveGroupTrainingFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
