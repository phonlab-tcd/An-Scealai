import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DigitalReaderStoryCreationDialogComponent } from './dr-story-creation-dialog.component';
import { MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BasicDialogComponent', () => {
  let component: DigitalReaderStoryCreationDialogComponent;
  let fixture: ComponentFixture<DigitalReaderStoryCreationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DigitalReaderStoryCreationDialogComponent ],
      imports: [HttpClientTestingModule], 
      providers: [
          { provide: MatDialog, useValue: {} },
          { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalReaderStoryCreationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
