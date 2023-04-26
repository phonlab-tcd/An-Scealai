import { Injectable } from '@angular/core';
import { Story } from '../story';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EngagementService } from '../engagement.service';
import { EventType } from '../event';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import config from 'abairconfig';
import {TextProcessingService} from './text-processing.service';
import { SynthesisBankService } from 'app/services/synthesis-bank.service';

interface APIv2Response {
  audioContent: string;
}

export const pseudonymMap = new Map([
  ['cmg', 'Tomás'],
  // ['nnc', 'Caitlín'],
  ['nnc', 'Neasa'],
 // ['ulster-male??', 'Aodh'],
  // ['anb', 'Róisín'],
  ['anb', 'Áine'],
  ['pmg', 'Macdara'],
  // ['snc', 'Anna'],
  ['snc', 'Sibéal'],
  ['roisin', 'Gráinne'],
] as const);

type PseudonymKey = typeof pseudonymMap extends Map<infer K, any> ? K : never;

const asVoice = (x: readonly VoiceChecks[])=>x;
export const voices = asVoice([ // for extra type checking (typescript will check that codes are valid)
//{api: 'api2', note: '', gender: 'male',   shortCode: '???', code: '???',                dialect: 'UL', algorithm: 'dnn'},
  {api: 'api2', note: '', gender: 'female', shortCode: 'anb', code: 'ga_UL_anb_nemo', dialect: 'ulster', algorithm: 'dnn'},
  // {api: 'api2', note: '', gender: 'male',   shortCode: 'pmg', code: 'ga_CO_pmg_nnmnkwii', dialect: 'CO', algorithm: 'dnn'},
  {api: 'api2', note: '', gender: 'female', shortCode: 'snc', code: 'ga_CO_snc_nemo', dialect: 'connacht', algorithm: 'dnn'},
  // {api: 'api2', note: '', gender: 'male',   shortCode: 'cmg', code: 'ga_MU_cmg_nnmnkwii', dialect: 'MU', algorithm: 'dnn'},
  {api: 'api2', note: '', gender: 'female', shortCode: 'nnc', code: 'ga_MU_nnc_nemo', dialect: 'munster', algorithm: 'dnn'},

// //{api: 'api2', note: '',        gender: 'male',   shortCode: '???', code: '???',              dialect: 'UL', algorithm: 'hts'},
//   {api: 'api2', note: '[beta] ', gender: 'female', shortCode: 'anb', code: 'ga_UL_anb_exthts', dialect: 'UL', algorithm: 'hts'},
//   {api: 'api2', note: '[beta] ', gender: 'male',   shortCode: 'pmg', code: 'ga_CO_pmc_exthts', dialect: 'CO', algorithm: 'hts'},
//   {api: 'api2', note: '[beta] ', gender: 'female', shortCode: 'snc', code: 'ga_CO_snc_exthts', dialect: 'CO', algorithm: 'hts'},
//   // {api: 'api2', note: '[beta] ', gender: 'male',   shortCode: 'cmg', code: 'ga_MU_cmg_exthts', dialect: 'MU', algorithm: 'hts'},
//   {api: 'api2', note: '[beta] ', gender: 'female', shortCode: 'nnc', code: 'ga_MU_nnc_exthts', dialect: 'MU', algorithm: 'hts'},

//{api: 'nemo', note: '',        gender: 'male',   shortCode: '???', code: '????'                dialect: 'UL', algorithm: 'multidialect'},
  // {api: 'nemo', note: '[beta] ', gender: 'female', shortCode: 'anb', code: 'anb.multidialect',   dialect: 'UL', algorithm: 'multidialect'},
  // {api: 'nemo', note: '[beta] ', gender: 'male',   shortCode: 'pmg', code: 'pmg.multidialect',   dialect: 'CO', algorithm: 'multidialect'},
  // {api: 'nemo', note: '[beta] ', gender: 'female', shortCode: 'snc', code: 'snc.multidialect',   dialect: 'CO', algorithm: 'multidialect'},
  // {api: 'nemo', note: '[beta] ', gender: 'female', shortCode: 'nnc', code: 'nnc.multidialect',   dialect: 'MU', algorithm: 'multidialect'},
  // {api: 'nemo', note: '[beta] ', gender: 'female', shortCode: 'roisin', code: 'roisin.multidialect',dialect: 'CO', algorithm: 'multidialect'},
] as const);

type API = keyof typeof ApiOptions;

type VoiceChecks = {
  readonly code: VoiceCode;
  readonly api: API;
  readonly note: string;
  readonly gender: 'male' | 'female';
  readonly shortCode: PseudonymKey;
  //readonly dialect: 'UL'|'CO'|'MU';
  readonly dialect: 'ulster'|'connacht'|'munster';
  readonly algorithm: string;
};

export type Voice = typeof voices[number];

export function pseudonym(v: Voice) {
  return pseudonymMap.get(v.shortCode);
}

type DataUriMimeType = 'audio/mp3' | 'audio/ogg' | 'audio/x-aiff' | 'audio/wav';
const audioEncodingToDataUriMimeType = new Map<AudioEncoding, DataUriMimeType>([
  ['LINEAR16',  'audio/x-aiff'],
  ['MP3',       'audio/mp3'],
  ['OGG_OPUS',  'audio/ogg'],
  ['mp3',       'audio/mp3'],
  ['wav',       'audio/wav'],
]);

export type VoiceCode = typeof ApiOptions.api2.voice[number] | typeof ApiOptions.nemo.voice[number];
export type AudioEncoding = typeof ApiOptions.api2.audioEncoding[number] | typeof ApiOptions.nemo.audioEncoding[number];

export const ApiOptions = {
  api2: {
    base_url: 'https://www.abair.ie/api2/synthesise?',
    audioEncoding: ['MP3','LINEAR16', 'OGG_OPUS'],
    outputType: ['JSON','HTML','JSON_WITH_TIMING'],
    voice:["ga_UL_anb_exthts","ga_UL_anb_nemo","ga_CO_pmc_exthts","ga_CO_pmc_exthts-WORLD","ga_CO_pmg_nemo","ga_CO_snc_exthts","ga_CO_snc_exthts-WORLD","ga_CO_snc_exthts-WORLD-44-48","ga_CO_snc_exthts-WORLD-44-48-full","ga_CO_snc_nemo","ga_MU_nnc_exthts","ga_MU_nnc_nemo","ga_MU_cmg_nemo"],
  },
  nemo: {
    base_url: 'https://phoneticsrv3.lcs.tcd.ie/nemo/synthesise?',
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

export type Dialect = 'UL' | 'MU' | 'CO';

export interface SynthRequestObject {
  input: string;
  voice?: typeof ApiOptions.api2.voice[number]; // voice takes precedence over dialect. If a valid voice is given, ignore the dialect
  dialect?: Dialect;
  speed?: number;
  audioEncoding?: typeof ApiOptions.api2.audioEncoding[number];
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

  api2_voice_from_dialect(dialect: 'connemara' | 'kerry' | 'donegal'): typeof ApiOptions.api2.voice[number] {
    switch (dialect) {
      case 'connemara':
        return 'ga_CO_pmg_nemo';
      case 'kerry':
        return 'ga_MU_nnc_nemo';
      default: // donegal
        return 'ga_UL_anb_nemo';
    }
  }

  synthesiseHtml(input: string, ...theRest): Observable<any> {
    input = this.textProcessor.convertHtmlToPlainText(input);
    return this.synthesiseText(input, ...theRest );
  }

  synthesiseText(
    input: string,
    voice: Voice = undefined,
    useCache = true,
    audioEncoding: AudioEncoding = undefined,
    ): Observable<any> {
  
    // VALIDATION
    if (!input) throw new Error('input required');
    if (!voice) voice = voices[0];
    if(!audioEncoding) audioEncoding = ApiOptions[voice.api].audioEncoding[0];
    const url = this.request_url(input,voice,audioEncoding as AudioEncoding);

    // SHORTCUT?
    if(useCache) {
      const cachedDataUri = this.synthBank.getAudioUrlOfSentence(url);
      if (cachedDataUri) return of(cachedDataUri);
    }
    console.log(url);
    // HIT THE API
    return this.http.post(this.baseUrl + 'proxy',{url}).pipe(
     map((data: {audioContent: string}) => this.prependAudioUrlPrefix(data.audioContent, audioEncoding)),
     tap(data=>this.synthBank.storeAudioUrlOfSentence(url,data) ) );
  }


  request_url(
    input: string,
    voice: Voice = voices[0],
    audioEncoding: AudioEncoding = undefined,
  ): string {
    const options = ApiOptions[voice.api];
    const base_url = options.base_url;
    if ( !audioEncoding ) audioEncoding = options.audioEncoding[0];
    
    const fromObject = {
      input,
      voice: voice.code,
      audioEncoding,
      outputType: 'JSON',
    };
    const query = new HttpParams({fromObject}).toString();
    return base_url + query;
  }

  prependAudioUrlPrefix(base64AudioData: string, encoding: AudioEncoding){
    console.log(base64AudioData.slice(1000,1100));
    return 'data:' + audioEncodingToDataUriMimeType.get(encoding) + ';base64,' + base64AudioData;
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
