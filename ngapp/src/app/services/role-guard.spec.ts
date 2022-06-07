import { TestBed } from '@angular/core/testing';
import { RoleGuardService } from 'app/services/role-guard';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RoleGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, HttpClientTestingModule],
  }));

  it('should be created', () => {
    const service: RoleGuardService = TestBed.inject(RoleGuardService);
    expect(service).toBeTruthy();
  });
});
