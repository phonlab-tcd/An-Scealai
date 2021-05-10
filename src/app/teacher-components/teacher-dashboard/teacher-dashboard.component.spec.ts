import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherDashboardComponent } from './teacher-dashboard.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TeacherDashboardComponent', () => {
  let component: TeacherDashboardComponent;
  let fixture: ComponentFixture<TeacherDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [ TeacherDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
