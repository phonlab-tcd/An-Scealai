import { TestBed, async, inject } from '@angular/core/testing';

import { StopSoundGuard } from './stop-sound.guard';

describe('StopSoundGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StopSoundGuard]
    });
  });

  it('should ...', inject([StopSoundGuard], (guard: StopSoundGuard) => {
    expect(guard).toBeTruthy();
  }));
});
