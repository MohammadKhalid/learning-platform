import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveGroupTrainingPage } from './live-group-training.page';

describe('LiveGroupTrainingPage', () => {
  let component: LiveGroupTrainingPage;
  let fixture: ComponentFixture<LiveGroupTrainingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveGroupTrainingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveGroupTrainingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
