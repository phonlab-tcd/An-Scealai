import { TestBed } from '@angular/core/testing';

import { QuillHighlightService } from './quill-highlight.service';

describe('QuillHighlightService', () => {
  let service: QuillHighlightService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuillHighlightService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
