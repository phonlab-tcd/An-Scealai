import { TestBed } from '@angular/core/testing';
import { ClassroomService } from './classroom.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ClassroomService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, HttpClientTestingModule],
  }));

  it('should be created', () => {
    const service: ClassroomService = TestBed.get(ClassroomService);
    expect(service).toBeTruthy();
  });
});
