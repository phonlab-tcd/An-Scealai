import { TestBed } from '@angular/core/testing';
import { DigitalReaderStoryService } from './dr-story.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DigitalReaderStoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: DigitalReaderStoryService = TestBed.inject(DigitalReaderStoryService);
    expect(service).toBeTruthy();
  });
});
