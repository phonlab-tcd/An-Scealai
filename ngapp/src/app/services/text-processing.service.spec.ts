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
});
