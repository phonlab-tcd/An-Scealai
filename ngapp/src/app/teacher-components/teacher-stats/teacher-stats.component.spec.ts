import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherStatsComponent } from './teacher-stats.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TeacherStatsComponent', () => {
  let component: TeacherStatsComponent;
  let fixture: ComponentFixture<TeacherStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [ TeacherStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
