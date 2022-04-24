import { TestBed } from '@angular/core/testing';
import { AbairAPIv2AudioEncoding, SynthesisService, Dialect } from './synthesis.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SynthesisService', () => {
  beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, HttpClientTestingModule],
    });
  });

  const service: SynthesisService = TestBed.inject(SynthesisService);

  it('should be created', (done) => {
    expect(service).toBeTruthy();
    done();
  });

  describe('synthesiseText', () => {
    it('should create an observable which sends a valid audio URI', async (done) => {
      service.synthesiseText(
        'Dia dhuit a chara',
        'connemara' as Dialect,
        null,
        'MP3' as AbairAPIv2AudioEncoding,
      ).toPromise().then(
      audioURI => {
        expect(audioURI).toBeTruthy();
        const audioElement = new Audio(audioURI);
        expect(audioElement).toBeTruthy();
        expect(audioElement instanceof Audio).toBeTruthy();
        expect(audioElement.play instanceof Function).toBeTruthy();
        done();
      });
    });
  });
});
