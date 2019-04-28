import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveGroupTrainingSessionPage } from './live-group-training-session.page';

describe('LiveGroupTrainingSessionPage', () => {
  let component: LiveGroupTrainingSessionPage;
  let fixture: ComponentFixture<LiveGroupTrainingSessionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveGroupTrainingSessionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveGroupTrainingSessionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
