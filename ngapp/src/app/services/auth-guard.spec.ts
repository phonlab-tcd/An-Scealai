import { TestBed } from '@angular/core/testing';
import { AuthGuardService } from 'app/services/auth-guard';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, HttpClientTestingModule],
  }));

  it('should be created', () => {
    const service: AuthGuardService = TestBed.inject(AuthGuardService);
    expect(service).toBeTruthy();
  });
});
