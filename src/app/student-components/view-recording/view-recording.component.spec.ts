import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRecordingComponent } from './view-recording.component';

describe('ViewRecordingComponent', () => {
  let component: ViewRecordingComponent;
  let fixture: ComponentFixture<ViewRecordingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRecordingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRecordingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
