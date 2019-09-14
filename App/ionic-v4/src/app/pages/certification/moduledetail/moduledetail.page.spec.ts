import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuledetailPage } from './moduledetail.page';

describe('ModuledetailPage', () => {
  let component: ModuledetailPage;
  let fixture: ComponentFixture<ModuledetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuledetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuledetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
