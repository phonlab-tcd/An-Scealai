import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackendMonitorComponent } from './backend-monitor.component';

describe('BackendMonitorComponent', () => {
  let component: BackendMonitorComponent;
  let fixture: ComponentFixture<BackendMonitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackendMonitorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackendMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
