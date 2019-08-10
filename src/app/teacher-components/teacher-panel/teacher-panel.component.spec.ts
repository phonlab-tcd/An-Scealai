import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherPanelComponent } from './teacher-panel.component';

describe('TeacherPanelComponent', () => {
  let component: TeacherPanelComponent;
  let fixture: ComponentFixture<TeacherPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
