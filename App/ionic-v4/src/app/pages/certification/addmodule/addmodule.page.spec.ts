import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmodulePage } from './addmodule.page';

describe('AddmodulePage', () => {
  let component: AddmodulePage;
  let fixture: ComponentFixture<AddmodulePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddmodulePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddmodulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
