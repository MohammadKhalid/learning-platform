import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPersonalCoachingFormPage } from './request-personal-coaching-form.page';

describe('RequestPersonalCoachingFormPage', () => {
  let component: RequestPersonalCoachingFormPage;
  let fixture: ComponentFixture<RequestPersonalCoachingFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestPersonalCoachingFormPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestPersonalCoachingFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
