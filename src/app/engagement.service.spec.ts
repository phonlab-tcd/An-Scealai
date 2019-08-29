import { TestBed } from '@angular/core/testing';

import { EngagementService } from './engagement.service';

describe('EngagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EngagementService = TestBed.get(EngagementService);
    expect(service).toBeTruthy();
  });
});
