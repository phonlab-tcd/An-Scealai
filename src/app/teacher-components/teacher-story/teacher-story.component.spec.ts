import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherStoryComponent } from './teacher-story.component';

describe('TeacherStoryComponent', () => {
  let component: TeacherStoryComponent;
  let fixture: ComponentFixture<TeacherStoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherStoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherStoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
