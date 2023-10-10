import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordingDialogComponent } from './recording-dialog.component';
import { MatLegacyDialog as MatDialog, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RecordingDialogComponent', () => {
  let component: RecordingDialogComponent;
  let fixture: ComponentFixture<RecordingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordingDialogComponent ],
      imports: [HttpClientTestingModule], 
      providers: [
          { provide: MatDialog, useValue: {} },
          { provide: MatDialogRef, useValue: {} },
          { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
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
