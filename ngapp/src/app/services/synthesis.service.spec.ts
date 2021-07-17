import { TestBed } from '@angular/core/testing';
import { SynthesisService } from './synthesis.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SynthesisService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, HttpClientTestingModule],
  }));

  it('should be created', () => {
    const service: SynthesisService = TestBed.inject(SynthesisService);
    expect(service).toBeTruthy();
  });
});
