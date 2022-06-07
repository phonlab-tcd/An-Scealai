import { TestBed } from '@angular/core/testing';
import { ClassroomService } from 'app/services/classroom';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ClassroomService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, HttpClientTestingModule],
  }));

  it('should be created', () => {
    const service: ClassroomService = TestBed.inject(ClassroomService);
    expect(service).toBeTruthy();
  });
});
