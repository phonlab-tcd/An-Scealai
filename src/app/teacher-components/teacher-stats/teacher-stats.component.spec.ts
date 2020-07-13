import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherStatsComponent } from './teacher-stats.component';

describe('TeacherStatsComponent', () => {
  let component: TeacherStatsComponent;
  let fixture: ComponentFixture<TeacherStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
