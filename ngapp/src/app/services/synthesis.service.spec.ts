import { TestBed } from '@angular/core/testing';
import { SynthesisService } from './synthesis.service';
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

  it('should convert html text to plain text correctly', (done) => {
    const someHtml = '<h1>Some html</h1>';
    expect(service.convertToPlain(someHtml)).toEqual('Some html');
    done();
  });

  describe('synthesiseText', () => {
    it('should create an observable which sends a valid audio URI', (done) => {
      service.synthesiseText({
        input: 'Dia dhuit a chara',
        voice: service.voice('connemara'),
        audioEncoding: 'MP3',
        speed: 1,
      }).then(
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
