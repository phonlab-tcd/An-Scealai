import { TestBed } from '@angular/core/testing';

import { GrammarService } from './grammar.service';

describe('GrammarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GrammarService = TestBed.get(GrammarService);
    expect(service).toBeTruthy();
  });
});
