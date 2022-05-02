import { waitForAsync, TestBed } from '@angular/core/testing';
import { AbairAPIv2AudioEncoding, SynthesisService, Dialect } from './synthesis.service';
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


  it('should be created', (done) => {
    expect(service).toBeTruthy();
    done();
  });

  describe('synthesiseText', () => {
    it('should create an observable which sends a valid audio URI', (done) => {
      service.synthesiseText(
        'Dia dhuit a chara',
        'connemara' as Dialect,
        null,
        'MP3' as AbairAPIv2AudioEncoding,
      ).subscribe(
        audioURI => {
          expect(audioURI).toBeTruthy();
          const audioElement = new Audio(audioURI);
          expect(audioElement).toBeTruthy();
          expect(audioElement instanceof Audio).toBeTruthy();
          expect(audioElement.play instanceof Function).toBeTruthy();
          done();
        },
        () => done,
        () => done,
      );
    });
  });
  afterEach(()=>{
    service = null;
  });
});
