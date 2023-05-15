import { TestBed } from '@angular/core/testing';
import { TranslationService } from './translation.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TranslationService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, HttpClientTestingModule],
  }));

  it('should be created', () => {
    const service: TranslationService = TestBed.inject(TranslationService);
    expect(service).toBeTruthy();
  });
});
