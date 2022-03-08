import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordingDashboardComponent } from './recording-dashboard.component';

describe('RecordingDashboardComponent', () => {
  let component: RecordingDashboardComponent;
  let fixture: ComponentFixture<RecordingDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordingDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordingDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
