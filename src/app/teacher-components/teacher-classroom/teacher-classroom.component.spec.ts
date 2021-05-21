import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherClassroomComponent } from './teacher-classroom.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TeacherClassroomComponent', () => {
  let component: TeacherClassroomComponent;
  let fixture: ComponentFixture<TeacherClassroomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [ TeacherClassroomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherClassroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
