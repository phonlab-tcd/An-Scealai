import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentStatsDashboardComponent } from './student-stats-dashboard.component';

describe('StudentStatsDashboardComponent', () => {
  let component: StudentStatsDashboardComponent;
  let fixture: ComponentFixture<StudentStatsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentStatsDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentStatsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
