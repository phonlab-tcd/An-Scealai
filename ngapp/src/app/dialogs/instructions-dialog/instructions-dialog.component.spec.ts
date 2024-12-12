import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InstructionsDialogComponent } from './instructions-dialog.component';
import { MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BasicDialogComponent', () => {
  let component: InstructionsDialogComponent;
  let fixture: ComponentFixture<InstructionsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstructionsDialogComponent ],
      imports: [HttpClientTestingModule], 
      providers: [
          { provide: MatDialog, useValue: {} },
          { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
