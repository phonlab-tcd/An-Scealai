import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordingHistoryComponent } from './recording-history.component';

describe('RecordingHistoryComponent', () => {
  let component: RecordingHistoryComponent;
  let fixture: ComponentFixture<RecordingHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordingHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
