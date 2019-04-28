import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBoxPage } from './chat-box.page';

describe('ChatBoxPage', () => {
  let component: ChatBoxPage;
  let fixture: ComponentFixture<ChatBoxPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatBoxPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatBoxPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
