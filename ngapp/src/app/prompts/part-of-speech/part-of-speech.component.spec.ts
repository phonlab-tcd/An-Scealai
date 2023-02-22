import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PartOfSpeechComponent } from './part-of-speech.component';

describe('PartOfSpeechComponent', () => {
  let component: PartOfSpeechComponent;
  let fixture: ComponentFixture<PartOfSpeechComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartOfSpeechComponent ],
      imports: [HttpClientTestingModule, ReactiveFormsModule, FormsModule ],
      providers: [
        { provide: MatDialog, useValue: {} }
    ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartOfSpeechComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
