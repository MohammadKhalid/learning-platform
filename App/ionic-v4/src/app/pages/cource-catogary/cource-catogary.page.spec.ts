import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourceCatogaryPage } from './cource-catogary.page';

describe('CourceCatogaryPage', () => {
  let component: CourceCatogaryPage;
  let fixture: ComponentFixture<CourceCatogaryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourceCatogaryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourceCatogaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
