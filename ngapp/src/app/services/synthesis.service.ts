import { Injectable } from '@angular/core';
import { Story } from '../story';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EngagementService } from '../engagement.service';
import { EventType } from '../event';
import {
  Observable,
  of,
  Observer } from 'rxjs';
import {
  map,
  tap } from 'rxjs/operators';
import config from 'abairconfig';
import {TextProcessingService} from './text-processing.service';
import { SynthesisBankService } from 'app/services/synthesis-bank.service';

interface APIv2Response {
  audioContent: string;
}

export const options = {
  api2: {
    audioEncoding: ['LINEAR16', 'MP3', 'OGG_OPUS'],
    outputType: ['JSON','HTML','JSON_WITH_TIMING'],
    voice: [
     'ga_UL_anb_nnmnkwii',
     'ga_UL',
     'ga_UL_anb_exthts',
     'ga_CO',
     'ga_CO_hts',
     'ga_CO_pmg_nnmnkwii',
     'ga_MU_nnc_exthts',
     'ga_MU_nnc_nnmnkwii',
     'ga_MU_cmg_nnmnkwii'
    ],
  },
  nemo: {
    audioEncoding: ['mp3','wav'],
    outputType: ['JSON','HTML'],
    voice: [
      'anyspeaker',
      'roisin.multidialect',
      'anb.multidialect',
      'snc.multidialect',
      'pmg.multidialect',
      'nnc.multidialect',
      'roisin.nemo',
      'anb.nemo',
      'snc.nemo',
      'pmg.nemo',
      'nnc.nemo'
    ],
  },
} as const;

export type Dialect = 'connemara' | 'kerry' | 'donegal';

export interface SynthRequestObject {
  input: string;
  voice?: typeof options.api2.voice[number]; // voice takes precedence over dialect. If a valid voice is given, ignore the dialect
  dialect?: Dialect;
  speed?: number;
  audioEncoding?: typeof options.api2.audioEncoding[number];
}

@Injectable({
  providedIn: 'root'
})
export class SynthesisService {

  constructor(
    private http: HttpClient,
    private engagement: EngagementService,
    private textProcessor: TextProcessingService,
    private synthBank: SynthesisBankService,
  ) { }

  baseUrl = config.baseurl;

  api2_voice_from_dialect(dialect: 'connemara' | 'kerry' | 'donegal'): typeof options.api2.voice[number] {
    switch (dialect) {
      case 'connemara':
        return 'ga_CO_pmg_nnmnkwii';
      case 'kerry':
        return 'ga_MU_nnc_nnmnkwii';
      default: // donegal
        return 'ga_UL_anb_nnmnkwii';
    }
  }

  synthesiseHtml(input: string, api: keyof typeof options = 'api2',...theRest): Observable<any> {
    input = this.textProcessor.convertHtmlToPlainText(input);
    return this.synthesiseTextApi2(input, ...theRest );
  }

  nemo_url(input,voice,audioEncoding) {
    const url_base = 'https://phoneticsrv3.lcs.tcd.ie/nemo/synthesise?';
    const fromObject = {
  	  input,
  	  voice,
  	  audioEncoding,
  	  outputType: 'JSON',
    };
    const params = new HttpParams({fromObject}).toString();
    const url = url_base + params;
    return url;
  };

  synthesiseTextNemo(
    input: string,
    voice: typeof options.nemo.voice[number] = null,
    audioEncoding: typeof options.api2.audioEncoding[number] = 'MP3',
    speed: number = 1, ): Observable<any> {
    const url = this.nemo_url(input,voice,audioEncoding);
    const cachedUrl = this.synthBank.getAudioUrlOfSentence(url);
    if(cachedUrl) { return of(cachedUrl) }


    const encoding = audioEncoding.toLowerCase();
    return this.http.get<{audioContent: string}>(url).pipe(
     map(data=>this.prependAudioUrlPrefix(data.audioContent, encoding as any)),
     tap(data=>this.synthBank.storeAudioUrlOfSentence(url,data) ) );
  }

  synthesiseTextApi2(
    input: string,
    dialect: Dialect = 'connemara',
    voice: typeof options.api2.voice[number] = null,
    audioEncoding: typeof options.api2.audioEncoding[number] = 'MP3',
    speed: number = 1, ): Observable<any> {
  
    console.log('new synthesis');
    if (!input) {
      throw new Error('input required');
    }

    const url = this.api2_url(input,dialect,voice,audioEncoding,speed);
    const storedUrl = this.synthBank.getAudioUrlOfSentence(url);
    if (storedUrl) {
      return of(storedUrl);
    }

    return this.http.get(url).pipe(
     map((data: {audioContent: string}) => this.prependAudioUrlPrefix(data.audioContent, audioEncoding.toLowerCase() as 'mp3' | 'wav' | 'ogg') ),
     tap(data=>this.synthBank.storeAudioUrlOfSentence(url,data) ) );
  }


  api2_url(
    input: string,
    dialect: Dialect = 'connemara',
    voice: typeof options.api2.voice[number] = null,
    audioEncoding: typeof options.api2.audioEncoding[number] = 'MP3',
    speed: number = 1,
  ): string {
    const url_base = 'https://www.abair.ie/api2/synthesise?';

    if ( voice && options.api2.voice.includes(voice) ) {
      // use given voice
    } else {
      // get voice for given dialect
      voice = this.api2_voice_from_dialect(dialect);
    }

    const q = new HttpParams({fromObject: {
      input,
      voice,
      audioEncoding,
      outputType: 'JSON_WITH_TIMING',
      speed: "1",
    }});

    return url_base + q.toString();
  }

  prependAudioUrlPrefix(base64AudioData: string, encoding: 'mp3' | 'wav' | 'ogg'){
    return 'data:audio/' + encoding + ';base64,' + base64AudioData;
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
    const synthesisResponse =
      await this.http.post(
        this.baseUrl + 'story/synthesiseObject/',
        {story: storyObject},
      ).toPromise() as SynthesisResponse;

    const sentences: Sentence[] = [];
    const paragraphs: Paragraph[] = [];
    synthesisResponse.html.forEach((sentenceHtmlArray, i) => {
      const paragraphSentences: Sentence[] = [];
      for (const sentenceHtml of sentenceHtmlArray) {
        // sentenceSpan contains a span child for each word in the sentence
        const sentenceSpan = this.textToElem(sentenceHtml) as HTMLSpanElement;
        const startTime = +sentenceSpan.children[0].getAttribute('data-begin');
        const lastSentenceChild =
          sentenceSpan.children[sentenceSpan.childElementCount - 1]
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
      s.classList.remove("highlight");
      s.classList.remove("noHighlight");
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
  html: Array<string[]>
}
