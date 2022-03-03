import { TestBed } from '@angular/core/testing';

import { SynthesisBankService } from './synthesis-bank.service';

describe('SynthesisBankService', () => {
  let service: SynthesisBankService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SynthesisBankService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
