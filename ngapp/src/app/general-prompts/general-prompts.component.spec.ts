import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralPromptsComponent } from './general-prompts.component';

describe('GeneralPromptsComponent', () => {
  let component: GeneralPromptsComponent;
  let fixture: ComponentFixture<GeneralPromptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralPromptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralPromptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
