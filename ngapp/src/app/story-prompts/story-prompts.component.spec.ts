import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryPromptsComponent } from './story-prompts.component';

describe('StoryPromptsComponent', () => {
  let component: StoryPromptsComponent;
  let fixture: ComponentFixture<StoryPromptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoryPromptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoryPromptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
