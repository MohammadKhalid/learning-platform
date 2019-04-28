import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AskExpertFormPage } from './ask-expert-form.page';

describe('AskExpertFormPage', () => {
  let component: AskExpertFormPage;
  let fixture: ComponentFixture<AskExpertFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AskExpertFormPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AskExpertFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
