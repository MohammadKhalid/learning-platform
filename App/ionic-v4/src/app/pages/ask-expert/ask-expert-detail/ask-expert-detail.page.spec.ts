import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AskExpertDetailPage } from './ask-expert-detail.page';

describe('AskExpertDetailPage', () => {
  let component: AskExpertDetailPage;
  let fixture: ComponentFixture<AskExpertDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AskExpertDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AskExpertDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
