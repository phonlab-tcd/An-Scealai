import { TestBed, async, inject } from '@angular/core/testing';

import { CanDeactivateSaveGuard } from './can-deactivate.guard';

describe('CanDeactivateSaveGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanDeactivateSaveGuard]
    });
  });

  it('should ...', inject([CanDeactivateSaveGuard], (guard: CanDeactivateSaveGuard) => {
    expect(guard).toBeTruthy();
  }));
});
