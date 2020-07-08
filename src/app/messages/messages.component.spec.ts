import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherMessagesComponent } from './teacher-messages.component';

describe('TeacherMessagesComponent', () => {
  let component: TeacherMessagesComponent;
  let fixture: ComponentFixture<TeacherMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
