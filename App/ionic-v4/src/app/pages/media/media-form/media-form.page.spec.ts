import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaFormPage } from './media-form.page';

describe('MediaFormPage', () => {
  let component: MediaFormPage;
  let fixture: ComponentFixture<MediaFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaFormPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
