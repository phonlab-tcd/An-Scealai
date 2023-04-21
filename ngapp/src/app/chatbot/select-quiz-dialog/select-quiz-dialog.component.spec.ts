import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectQuizDialogComponent } from './select-quiz-dialog.component';

describe('SelectQuizDialogComponent', () => {
  let component: SelectQuizDialogComponent;
  let fixture: ComponentFixture<SelectQuizDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectQuizDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectQuizDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
