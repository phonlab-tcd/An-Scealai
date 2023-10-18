import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClassroomSelectorComponent } from './classroom-selector.component';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ClassroomSelectorComponent', () => {
  let component: ClassroomSelectorComponent;
  let fixture: ComponentFixture<ClassroomSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassroomSelectorComponent ],
      imports: [HttpClientTestingModule], 
      providers: [
          { provide: MatDialogRef, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassroomSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
