import { TestBed } from '@angular/core/testing';
import { StoryService } from './story.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('StoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: StoryService = TestBed.inject(StoryService);
    expect(service).toBeTruthy();
  });
});
