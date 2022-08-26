import { waitForAsync, TestBed } from '@angular/core/testing';
import { SynthesisService } from './synthesis.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe('SynthesisService', () => {
  let service: SynthesisService;
  beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, HttpClientModule],
    });
  }));

  beforeEach(()=>{
    service = TestBed.inject(SynthesisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate a url', ()=>{
    expect(service.request_url('dia dhuit',undefined)).toMatch(/^https/);
  });
});
