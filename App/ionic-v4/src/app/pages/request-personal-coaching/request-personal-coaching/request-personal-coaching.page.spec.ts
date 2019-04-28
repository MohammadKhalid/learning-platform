import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPersonalCoachingPage } from './request-personal-coaching.page';

describe('RequestPersonalCoachingPage', () => {
  let component: RequestPersonalCoachingPage;
  let fixture: ComponentFixture<RequestPersonalCoachingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestPersonalCoachingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestPersonalCoachingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
