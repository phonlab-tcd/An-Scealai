import { TestBed, waitForAsync } from '@angular/core/testing';
import { SynthItem, } from './synth-item';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { SynthService } from './synth.service';

describe('SynthItem', () => {
  beforeEach(waitForAsync(()=>{
    TestBed.configureTestingModule({
      imports: [ HttpClientModule, RouterTestingModule ],
      providers: [ SynthesisService ],
    })
    .compileComponents();
  }));
  it('should create an instance', () => {
    
    expect(new SynthItem('hello',undefined,TestBed.inject(SynthesisService))).toBeTruthy();
  });
});
