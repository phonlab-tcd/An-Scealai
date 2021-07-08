import { Injectable } from '@angular/core';
import { Story } from '../story';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EngagementService } from '../engagement.service';
import { EventType } from '../event';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import config from '../../abairconfig.json';


@Injectable({
  providedIn: 'root',
})
export class SynthesisService {

  constructor(private http: HttpClient, private engagement: EngagementService) { }

  baseUrl = config.baseurl;

  public api2encodings =
    [ 'MP3',
      'WAV',
      'OGG'];

  public api2voices = 
    [ 'ga_UL_anb_nnmnkwii',
      'ga_UL',
      'ga_UL_anb_exthts',
      'ga_CO',
      'ga_CO_hts',
      'ga_CO_pmg_nnmnkwii',
      'ga_MU_nnc_exthts',
      'ga_MU_nnc_nnmnkwii',
      'ga_MU_cmg_nnmnkwii'];


  public dialectToVoice(name: 'connemara' | 'ulster' | 'munster'): API_2_Voice {
    if (name === 'connemara') {
      return 'ga_CO_pmg_nnmnkwii' as API_2_Voice;
    }
    if (name === 'ulster') {
      return 'ga_UL_anb_nnmnkwii' as API_2_Voice;
    }
    return 'ga_MU_nnc_nnmnkwii' as API_2_Voice;
  }

  /**
   * Gets synthesis data for storyObject from
   * the backend, which comes in the form of HTML data.
   * Then parses that HTML data to populate Paragraph
   * and Sentence objects.
   *
   * @param storyObject - Story to be synthesised
   * @returns - Paragraph and Sentence objects containing data for
   * synthesis of input story.
   */
  async synthesiseStory(storyObject: Story): Promise<[Paragraph[], Sentence[]]> {
    const synthesisResponse = await this.http.post(this.baseUrl + 'story/synthesiseObject/', {story: storyObject}).toPromise() as SynthesisResponse;
    const sentences: Sentence[] = [];
    const paragraphs: Paragraph[] = [];
    synthesisResponse.html.forEach((sentenceHtmlArray, i) => {
      let paragraphSentences: Sentence[] = [];
      for (const sentenceHtml of sentenceHtmlArray) {
        // sentenceSpan contains a span child for each word in the sentence
        const sentenceSpan = this.textToElem(sentenceHtml) as HTMLSpanElement;
        const startTime = +sentenceSpan.children[0].getAttribute('data-begin');
        const lastSentenceChild = sentenceSpan.children[sentenceSpan.childElementCount-1]
        const duration = (+lastSentenceChild.getAttribute('data-begin') + +lastSentenceChild.getAttribute('data-dur')) - startTime;
        const audio = new Audio(synthesisResponse.audio[i]);
        
        let spans = Array.from(sentenceSpan.children) as HTMLSpanElement[];
        spans.forEach(span => span.classList.add('highlightable'));

        const sentence = new Sentence(audio, spans, startTime, duration);
        sentences.push(sentence);
        paragraphSentences.push(sentence);
      }
      const audio = new Audio(synthesisResponse.audio[i]);
      const spans = paragraphSentences.reduce((acc, sentence) => acc.concat(sentence.spans), []);
      const lastParagraphSentence = paragraphSentences[paragraphSentences.length - 1];
      const duration = lastParagraphSentence.startTime + lastParagraphSentence.duration;
      const paragraph = new Paragraph(audio, spans, duration);
      paragraphs.push(paragraph);
    });
    this.engagement.addEventForLoggedInUser(EventType['SYNTHESISE-STORY'], storyObject);
    return [paragraphs, sentences];
  }

  encodeParams(obj) {
    if (!obj) {
      return '';
    }
    const keys = Object.keys(obj);
    if (keys.length === 0) {
      return '';
    }
    let uri = '?';
    for (const key of keys) {
      if (obj[key]) {
        uri += '&' + key + '=' + encodeURIComponent(obj[key]);
      }
    }
    return uri;
  }

  api2_synthesise_post(req: {
      input: string,
      speed: number,
      voice: API_2_Voice,
      audioEncoding: API_2_Audio_Encoding,
  }): Observable<any> {
      // HttpParams encodes our url query params for us
      // const params = new HttpParams();
      // params.set('synthinput', input);
      // params.set('voice', voice);
      // params.set('speed', speed);
      // params.set('audioEncoding', audioEncoding);
      console.log('synthesise text:', req);
      const uri = 'https://www.abair.tcd.ie/api2/synthesise' + this.encodeParams(req);
      console.log(uri);
      return this.http.get(uri, {observe: 'body'})
      .pipe(
        map((val: { audioContent: string; }) => {
          console.dir(val);
          return URL.createObjectURL(
            new Blob(
              this.base64ToBlobPartsWrapped(val.audioContent)
            )
          );
        })
      );
    }

  // StackOverflow
  // https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
  base64ToBlobPartsWrapped(d: string) {
    const byteChars = atob(d);
    const byteNumbers = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
      byteNumbers[i] = byteChars.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return [byteArray];
  }

  /**
   * Converts a string of HTML code into a DOM Node object.
   * 
   * @param htmlString - String representation of a HTML object
   * @returns - A DOM Node representing htmlString
   */
  textToElem(htmlString: string): Node {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild; 
  } 
}

/**
 * Data structure to package / interact with synthesis data.
 * Contains synthesis audio, and synthesised words in
 * <span>s containing meta-data relevant to the synthesis
 * of that word, such as start time and duration.
 * 
 * Also provides functions to play, pause, and highlight
 * text in time with synthesis playback.
 */
export abstract class Section {

  audio: HTMLAudioElement;
  highlightTimeouts: NodeJS.Timer[] = [];
  pauseTimeout: NodeJS.Timer;
  spans: HTMLSpanElement[];
  startTime: number;
  duration: number;

  constructor(audio: HTMLAudioElement,  spans: HTMLSpanElement[], startTime: number, duration: number) {
    this.audio = audio;
    this.spans = spans;
    this.startTime = startTime;
    this.duration = duration;
  }

  /**
   * Play the synthesis audio for this section
   */
  play() {
    this.audio.currentTime = this.startTime;
    this.audio.play();
    this.pauseTimeout = setTimeout(() => {
      this.stop();
    }, this.duration * 1000);
  }

  /**
   * Stop any synthesis audio that is playing for this section
   */
  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
    clearTimeout(this.pauseTimeout);
  }

  /**
   * Highlight each word in this section in time with
   * its synthesis audio.
   */
  highlight() {
    let previousSpan: HTMLSpanElement;
    for (const s of this.spans) {
      // Each span will be highlighted halfway through its playback.
      // Each span is un-highlighted when the next span in the sequence
      //  is highlighted.
      this.highlightTimeouts.push(setTimeout(() => {
        if (previousSpan) previousSpan.classList.add("noHighlight");
        s.classList.add("highlight");
        previousSpan = s;
      }, ((+s.getAttribute("data-begin") * 1000)) + ((+s.getAttribute("data-dur") / 2) * 1000) - (this.startTime * 1000)));
    }
    this.highlightTimeouts.push(setTimeout(() => {
      this.removeHighlight();
    }, this.duration * 1000));
  }

  /**
   * Stop highlighting this section
   */
  removeHighlight() {
    for (const s of this.spans) {
      s.classList.remove('highlight');
      s.classList.remove('noHighlight');
    }
    this.highlightTimeouts.forEach(t => clearTimeout(t));
  }

}

export class Paragraph extends Section {
  constructor(audio: HTMLAudioElement,  spans: HTMLSpanElement[], duration: number) {
    super(audio, spans, 0, duration);
  }
}

export class Sentence extends Section { }

interface SynthesisResponse {
  audio: string[];
  html: Array<string[]>;
}

export type API_2_Voice =
  'ga_UL_anb_nnmnkwii' |
  'ga_UL' |
  'ga_UL_anb_exthts' |
  'ga_CO' |
  'ga_CO_hts' |
  'ga_CO_pmg_nnmnkwii' |
  'ga_MU_nnc_exthts' |
  'ga_MU_nnc_nnmnkwii' |
  'ga_MU_cmg_nnmnkwii';


export type API_2_Audio_Encoding =
  'MP3' |
  'WAV' |
  'OGG';
