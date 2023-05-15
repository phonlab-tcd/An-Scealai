import { TestBed } from '@angular/core/testing';

import { TextProcessingService } from './text-processing.service';

describe('TextProcessingService', () => {
  let service: TextProcessingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TextProcessingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('sentences', () => {
    it('should split this paragraph into three sentences:' +
       ' \'This is sentence 1. This is sentence two. This is the third sentence.\'', () => {
      const sentences =
        service.sentences('This is sentence 1. This is sentence two. This is the third sentence.');
      expect(sentences.length).toEqual(3); 
    });
  });
});
