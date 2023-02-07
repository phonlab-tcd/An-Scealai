import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BasicDialogComponent } from './basic-dialog.component';
import { MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BasicDialogComponent', () => {
  let component: BasicDialogComponent;
  let fixture: ComponentFixture<BasicDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicDialogComponent ],
      imports: [HttpClientTestingModule], 
      providers: [
          { provide: MatDialog, useValue: {} },
          { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
