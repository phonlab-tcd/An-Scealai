import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule  } from '@angular/common/http/testing';
import { StoryService             } from '../services/story';

describe('StoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: StoryService = TestBed.inject(StoryService);
    expect(service).toBeTruthy();
  });
});
