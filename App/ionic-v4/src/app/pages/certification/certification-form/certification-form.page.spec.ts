import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificationFormPage } from './certification-form.page';

describe('CertificationFormPage', () => {
  let component: CertificationFormPage;
  let fixture: ComponentFixture<CertificationFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificationFormPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificationFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
