import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptsPage } from './concepts.page';

describe('ConceptsPage', () => {
  let component: ConceptsPage;
  let fixture: ComponentFixture<ConceptsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConceptsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
