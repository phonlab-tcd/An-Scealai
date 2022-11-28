import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordingDialogComponent } from './recording-dialog.component';

describe('RecordingDialogComponent', () => {
  let component: RecordingDialogComponent;
  let fixture: ComponentFixture<RecordingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordingDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
