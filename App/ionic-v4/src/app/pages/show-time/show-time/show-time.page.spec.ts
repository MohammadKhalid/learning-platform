import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowTimePage } from './show-time.page';

describe('ShowTimePage', () => {
  let component: ShowTimePage;
  let fixture: ComponentFixture<ShowTimePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowTimePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowTimePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
