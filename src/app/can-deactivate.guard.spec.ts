import { TestBed, async, inject } from '@angular/core/testing';

import { CanDeactivateDashboardGuard, CanDeactivateRecordingGuard } from './can-deactivate.guard';

describe('CanDeactivateGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanDeactivateDashboardGuard, CanDeactivateRecordingGuard]
    });
  });

  it('should ...', inject([CanDeactivateDashboardGuard], (guard: CanDeactivateDashboardGuard) => {
    expect(guard).toBeTruthy();
  }));
});
