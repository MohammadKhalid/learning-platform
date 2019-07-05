import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelSettingsPage } from './level-settings.page';

describe('LevelSettingsPage', () => {
  let component: LevelSettingsPage;
  let fixture: ComponentFixture<LevelSettingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LevelSettingsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
