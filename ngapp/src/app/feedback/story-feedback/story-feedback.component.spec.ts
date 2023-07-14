import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryFeedbackComponent } from './story-feedback.component';

describe('StoryFeedbackComponent', () => {
  let component: StoryFeedbackComponent;
  let fixture: ComponentFixture<StoryFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoryFeedbackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoryFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
