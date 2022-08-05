import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaraPromptsComponent } from './lara-prompts.component';

describe('LaraPromptsComponent', () => {
  let component: LaraPromptsComponent;
  let fixture: ComponentFixture<LaraPromptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LaraPromptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LaraPromptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
