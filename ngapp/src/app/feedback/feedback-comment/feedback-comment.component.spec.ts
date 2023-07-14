import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackCommentComponent } from './feedback-comment.component';

describe('FeedbackCommentComponent', () => {
  let component: FeedbackCommentComponent;
  let fixture: ComponentFixture<FeedbackCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedbackCommentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
