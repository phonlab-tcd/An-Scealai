import { TestBed } from '@angular/core/testing';

import { FeedbackCommentService } from './feedback-comment.service';

describe('FeedbackCommentService', () => {
  let service: FeedbackCommentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeedbackCommentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
