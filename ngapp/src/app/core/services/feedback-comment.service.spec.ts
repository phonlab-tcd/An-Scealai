import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';


import { FeedbackCommentService } from './feedback-comment.service';

describe('FeedbackCommentService', () => {
  let service: FeedbackCommentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(FeedbackCommentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
