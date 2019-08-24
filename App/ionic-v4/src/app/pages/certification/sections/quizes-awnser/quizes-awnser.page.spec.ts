import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizesAwnserPage } from './quizes-awnser.page';

describe('QuizesAwnserPage', () => {
  let component: QuizesAwnserPage;
  let fixture: ComponentFixture<QuizesAwnserPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizesAwnserPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizesAwnserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
