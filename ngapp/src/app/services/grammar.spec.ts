import { TestBed } from '@angular/core/testing';
import { GrammarService } from 'app/services/grammar';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('GrammarService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, HttpClientTestingModule],
  }));

  it('should be created', () => {
    const service: GrammarService = TestBed.inject(GrammarService);
    expect(service).toBeTruthy();
  });
});
