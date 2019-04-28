import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveGroupTrainingDetailPage } from './live-group-training-detail.page';

describe('LiveGroupTrainingDetailPage', () => {
  let component: LiveGroupTrainingDetailPage;
  let fixture: ComponentFixture<LiveGroupTrainingDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveGroupTrainingDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveGroupTrainingDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
