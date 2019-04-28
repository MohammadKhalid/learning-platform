import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowTimeFormPage } from './show-time-form.page';

describe('ShowTimeFormPage', () => {
  let component: ShowTimeFormPage;
  let fixture: ComponentFixture<ShowTimeFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowTimeFormPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowTimeFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
