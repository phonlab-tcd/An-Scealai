import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PromptsComponent } from './prompts.component';

describe('PromptsComponent', () => {
  let component: PromptsComponent;
  let fixture: ComponentFixture<PromptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromptsComponent ],
      imports: [HttpClientTestingModule, ReactiveFormsModule, FormsModule, RouterTestingModule ],
      providers: [
        { provide: MatDialog, useValue: {} }
    ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
