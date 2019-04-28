import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AskExpertPage } from './ask-expert.page';

describe('AskExpertPage', () => {
  let component: AskExpertPage;
  let fixture: ComponentFixture<AskExpertPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AskExpertPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AskExpertPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
