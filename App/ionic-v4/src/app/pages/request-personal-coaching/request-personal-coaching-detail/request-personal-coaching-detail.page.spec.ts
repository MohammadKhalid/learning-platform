import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPersonalCoachingDetailPage } from './request-personal-coaching-detail.page';

describe('RequestPersonalCoachingDetailPage', () => {
  let component: RequestPersonalCoachingDetailPage;
  let fixture: ComponentFixture<RequestPersonalCoachingDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestPersonalCoachingDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestPersonalCoachingDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
