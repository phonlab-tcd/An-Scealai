import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateExamPromptsComponent } from './state-exam-prompts.component';

describe('StateExamPromptsComponent', () => {
  let component: StateExamPromptsComponent;
  let fixture: ComponentFixture<StateExamPromptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StateExamPromptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StateExamPromptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
