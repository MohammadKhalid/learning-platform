import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaViewerPage } from './media-viewer.page';

describe('MediaViewerPage', () => {
  let component: MediaViewerPage;
  let fixture: ComponentFixture<MediaViewerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaViewerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaViewerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
