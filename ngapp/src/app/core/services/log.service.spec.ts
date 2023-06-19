import { TestBed } from '@angular/core/testing';

import { LogService } from './log.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LogService', () => {
  let service: LogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(LogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
