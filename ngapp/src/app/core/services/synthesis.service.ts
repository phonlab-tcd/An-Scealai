import { Injectable } from "@angular/core";
import { Story } from "app/core/models/story";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EngagementService } from "app/core/services/engagement.service";
import { EventType } from "app/core/models/event";
import { Observable, firstValueFrom, of } from "rxjs";
import { map, tap } from "rxjs/operators";
import config from "abairconfig";
import { SynthesisCacheService } from "app/core/services/synthesis-cache.service";

// variable defining the different options for API calls
const ApiOptions = {
  base_url: "https://www.abair.ie/api2/synthesise",
  audioEncoding: ["MP3", "LINEAR16", "OGG_OPUS", "wav"],
  outputType: ["JSON", "HTML", "JSON_WITH_TIMING"],
  voiceCode: [
    "ga_UL_anb_nemo",
    "ga_CO_snc_nemo",
    "ga_MU_nnc_nemo",
    "ga_MU_cmg_nnmnkwii",
    "ga_CO_pmc_nemo",
  ],
} as const;

// type defining the possible values of a voice code
export type VoiceCode = (typeof ApiOptions.voiceCode)[number];

// type defining all the properties of a voice
type VoiceConfig = {
  readonly code: VoiceCode;
  readonly name: string;
  readonly gender: "male" | "female";
  readonly shortCode: "nnc" | "anb" | "snc" | "cmg" | "pmc";
  readonly dialect: "ulster" | "connacht" | "munster";
  readonly algorithm: "piper" | "nemo" | "dnn" | "hts" | "multidialect";
};

// function to check that all possible voices are of the type VoiceChecks (typescript will check that codes are valid)
const asVoice = (x: readonly VoiceConfig[]) => x;

// list of possible voice configurations for synthesis
export const voices = asVoice([
  { name: "Sibéal", gender: "female", shortCode: "snc", code: "ga_CO_snc_nemo", dialect: "connacht", algorithm: "nemo", },
  { name: "Áine", gender: "female", shortCode: "anb", code: "ga_UL_anb_nemo", dialect: "ulster", algorithm: "nemo", },
  { name: "Pádraig", gender: "male", shortCode: "pmc", code: "ga_CO_pmc_nemo", dialect: "connacht", algorithm: "nemo", },
  { name: "Neasa", gender: "female", shortCode: "nnc", code: "ga_MU_nnc_nemo", dialect: "munster", algorithm: "nemo", },
  { name: "Colm", gender: "male", shortCode: "cmg", code: "ga_MU_cmg_nnmnkwii", dialect: "munster", algorithm: "dnn", },
] as const);

// type defining an entry in the VoiceConfig array
export type Voice = (typeof voices)[number];

// type defining the possible values of a voice audio encoding
export type AudioEncoding = (typeof ApiOptions.audioEncoding)[number];

// type defining the different possible audio mime types
type DataUriMimeType = "audio/mp3" | "audio/ogg" | "audio/x-aiff" | "audio/wav";

// map paring up a an audio encoding with an audio mime type
const audioEncodingToDataUriMimeType = new Map<AudioEncoding, DataUriMimeType>([
  ["LINEAR16", "audio/x-aiff"],
  ["MP3", "audio/mp3"],
  ["OGG_OPUS", "audio/ogg"],
  ["wav", "audio/wav"],
]);

@Injectable({
  providedIn: "root",
})
export class SynthesisService {
  constructor(
    private http: HttpClient,
    private engagement: EngagementService,
    private synthCacheService: SynthesisCacheService
  ) {}

  baseUrl = config.baseurl;

  /**
   * Synthesise text given certain voice parameters
   * @param textInput story text input
   * @param voice voice as defined from entry in VoiceConfig
   * @param useCache true if using cache, false otherwise
   * @param audioEncoding audio encoding as defined in VoiceConfig
   * @returns synthesised audio
   */
  synthesiseText(
    textInput: string,
    voice: Voice | undefined = undefined,
    useCache = true,
    audioEncoding: AudioEncoding | undefined = undefined,
    speed: number | undefined = 1
  ): Observable<any> {
    // Validation
    if (!textInput) throw new Error("story text input required");
    if (!voice) voice = voices[0];
    if (!audioEncoding) audioEncoding = ApiOptions.audioEncoding[0];

    // Get audio from cache if text already synthesised => TODO test
    const cacheKey = this.createCacheId(textInput, voice.code, speed)
    if (useCache) {
      const cachedAudio = this.synthCacheService.getSynthesisResponseForSentence( cacheKey );
      if (cachedAudio) return of(cachedAudio);
    }

    const reqBody: any = {
      synthinput: {
        text: textInput,
        normalised: true,
      },
      voiceparams: {
        languageCode: "ga-IE",
        name: voice.code,
      },
      audioconfig: {
        audioEncoding: audioEncoding,
        speakingRate: speed,
        pitch: 1,
      },
      timing: "WORD"
    };

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    // Otherwise send text to api
    return this.http.post<any>("https://abair.ie/api2/synthesise", reqBody, httpOptions)
      .pipe(
        // construct returned api audio url with given encoding preferences
        map((data: { audioContent: string, timing: {word: string, end: number, originalWord: string}[] }) => {
          return {audioUrl: this.prependAudioUrlPrefix(data.audioContent, audioEncoding!), timing: data.timing}
        }
        ),
        // store audio in cache
        tap((data) =>
          this.synthCacheService.storeSynthesisResponse(cacheKey, data)
        )
      );
  }

  createCacheId(textInput: string, voice: string, speed: number ): string {
    return this.synthCacheService.createCacheKey( textInput, voice, speed );
  }

  /**
   * Construct audio url from synthesis response with encoding specified in VoiceConfig
   * @param base64AudioData audio content returned from synthesis api
   * @param encoding audio encoding as specified in VoiceConfig
   * @returns constructed audio url
   */
  prependAudioUrlPrefix(base64AudioData: string, encoding: AudioEncoding) {
    return ( "data:" + audioEncodingToDataUriMimeType.get(encoding) + ";base64," + base64AudioData );
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
  async synthesiseStory(
    storyObject: Story
  ): Promise<[Paragraph[], Sentence[]]> {
    // const synthesisResponse = (await this.http
    //   .post(this.baseUrl + "story/synthesiseObject/", { story: storyObject })
    //   .toPromise()) as SynthesisResponse;


    const paragraphsTest = storyObject.text.split(/\n\s*\n/);

    const sentences: Sentence[] = [];
    const paragraphs: Paragraph[] = [];

    let startTime = 0;
    let paragraphDuration = 0;
    

    for (let paragraphEntry of paragraphsTest) {
      const paragraphSentences: Sentence[] = [];
      paragraphEntry = paragraphEntry.trim()
      const parsedSentences = paragraphEntry.split(/[\.\!\?\;\:\n]\s+/);
      let sentenceDuration = 0;
      
      let paragraphAudioUrls = [];
      for (let sentenceEntry of parsedSentences) {
        const synthesisedSentence = await firstValueFrom(this.synthesiseText(sentenceEntry));
        startTime = 0;
        const wordSpans = synthesisedSentence.timing.map((entry: any) => {
          const span = this.wordToSpan(entry.originalWord, startTime, entry.end - startTime);
          startTime = entry.end;
          sentenceDuration = sentenceDuration + entry.end;
          paragraphDuration = paragraphDuration + sentenceDuration;
          return span;
        });
        //const sentenceSpan = this.wordSpanToSentenceSpan(wordSpans) as HTMLSpanElement;
        const audio = new Audio(synthesisedSentence.audioUrl);
        const sentence = new Sentence(audio, wordSpans, 0, sentenceDuration);
        sentences.push(sentence);
        paragraphSentences.push(sentence);
        paragraphAudioUrls.push(synthesisedSentence.audioUrl);
      }

      const combinedBlobUrl = await this.combineAudioSources(paragraphAudioUrls);
      const audio = new Audio(combinedBlobUrl);
      const spans = paragraphSentences.reduce( (acc, sentence) => acc.concat(sentence.spans), [] );
      const paragraph = new Paragraph(audio, spans, paragraphDuration);
      paragraphs.push(paragraph);
    }

    console.log(sentences)
    console.log(paragraphs);


    // synthesisResponse.html.forEach((sentenceHtmlArray, i) => {
    //   const paragraphSentences: Sentence[] = [];
    //   for (const sentenceHtml of sentenceHtmlArray) {
    //     // sentenceSpan contains a span child for each word in the sentence
    //     const sentenceSpan = this.textToElem(sentenceHtml) as HTMLSpanElement;
    //     const startTime = +sentenceSpan.children[0].getAttribute("data-begin")!;
    //     const lastSentenceChild =
    //       sentenceSpan.children[sentenceSpan.childElementCount - 1];
    //     const duration =
    //       +lastSentenceChild.getAttribute("data-begin")! +
    //       +lastSentenceChild.getAttribute("data-dur")! -
    //       startTime;
    //     const audio = new Audio(synthesisResponse.audio[i]);

    //     let spans = Array.from(sentenceSpan.children) as HTMLSpanElement[];
    //     spans.forEach((span) => span.classList.add("highlightable"));

    //     const sentence = new Sentence(audio, spans, startTime, duration);
    //     sentences.push(sentence);
    //     paragraphSentences.push(sentence);
    //   }
    //   const audio = new Audio(synthesisResponse.audio[i]);
    //   const spans = paragraphSentences.reduce(
    //     (acc, sentence) => acc.concat(sentence.spans),
    //     []
    //   );
    //   const lastParagraphSentence =
    //     paragraphSentences[paragraphSentences.length - 1];
    //   const duration =
    //     lastParagraphSentence.startTime + lastParagraphSentence.duration;
    //   const paragraph = new Paragraph(audio, spans, duration);
    //   paragraphs.push(paragraph);
    // });
    // this.engagement.addEventForLoggedInUser(
    //   EventType["SYNTHESISE-STORY"],
    //   storyObject
    // );
    return [paragraphs, sentences];
  }

  /**
   * Converts a string of HTML code into a DOM Node object.
   * @param htmlString - String representation of a HTML object
   * @returns - A DOM Node representing htmlString
   */
  textToElem(htmlString: string): Node {
    var div = document.createElement("div");
    div.innerHTML = htmlString;
    return div.firstChild!;
  }

  wordToSpan(word: string, startTime: number, duration: number): Node {
    const span = document.createElement("span");
    span.textContent = word.trim();
    span.setAttribute("data-begin", startTime.toString());
    span.setAttribute("data-dur", duration.toString());
    span.classList.add("highlightable");
    return span;
  }
  
  wordSpanToSentenceSpan(wordSpans: Node[]) {
    const divElement = document.createElement('div');
    wordSpans.forEach(span => {
      divElement.appendChild(span);
    });
    return divElement;
  }

  async combineAudioSources(audioUrls: string[]) {
    const proms = audioUrls.map((uri) =>
      fetch(uri).then((r) => r.blob())
    );

    const blobs = await Promise.all(proms);
    const blob = new Blob(blobs, { type: 'mp3' });
    const blobUrl = URL.createObjectURL(blob);
    return blobUrl;
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

  constructor(
    audio: HTMLAudioElement,
    spans: HTMLSpanElement[],
    startTime: number,
    duration: number
  ) {
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
      console.log(s);
      // Each span will be highlighted halfway through its playback.
      // Each span is un-highlighted when the next span in the sequence
      //  is highlighted.
      this.highlightTimeouts.push(
        setTimeout(() => {
          if (previousSpan) previousSpan.classList.add("noHighlight");
          s.classList.add("highlight");
          previousSpan = s;
        }, +s.getAttribute("data-begin")! * 1000 + (+s.getAttribute("data-dur")! / 2) * 1000 - this.startTime * 1000)
      );
    }
    this.highlightTimeouts.push(
      setTimeout(() => {
        this.removeHighlight();
      }, this.duration * 1000)
    );
  }

  /**
   * Stop highlighting this section
   */
  removeHighlight() {
    for (const s of this.spans) {
      s.classList.remove("highlight");
      s.classList.remove("noHighlight");
      console.log("REMOVE HIGHLIGHT: ", s)
    }
    this.highlightTimeouts.forEach((t) => clearTimeout(t));
  }
}

export class Paragraph extends Section {
  constructor(
    audio: HTMLAudioElement,
    spans: HTMLSpanElement[],
    duration: number
  ) {
    super(audio, spans, 0, duration);
  }
}

export class Sentence extends Section {}

interface SynthesisResponse {
  audio: string[];
  html: Array<string[]>;
}

/////////////////////////////////////////////////////////////////////// Additional Data //////////////////////////////////
/**
 * Additional short code -> name pairings (data structure now depricated)
 *
 * ['nnc', 'Caitlín'],
 * ['ulster-male??', 'Aodh'],
 * ['anb', 'Róisín'],
 * ['snc', 'Anna'],
 */

/**
 * Additional VoiceCheck entries (DNN, HTS, multidialect)
 *
 * {api: 'api2', note: '', gender: 'male', shortCode: '???', code: '???', dialect: 'UL', algorithm: 'dnn'},
 * {api: 'api2', note: '', gender: 'male', shortCode: 'pmg', code: 'ga_CO_pmg_nnmnkwii', dialect: 'CO', algorithm: 'dnn'},
 * {api: 'api2', note: '', gender: 'male', shortCode: 'cmg', code: 'ga_MU_cmg_nnmnkwii', dialect: 'MU', algorithm: 'dnn'},
 *
 * {api: 'api2', note: '', gender: 'male',   shortCode: '???', code: '???', dialect: 'UL', algorithm: 'hts'},
 * {api: 'api2', note: '[beta] ', gender: 'female', shortCode: 'anb', code: 'ga_UL_anb_exthts', dialect: 'UL', algorithm: 'hts'},
 * {api: 'api2', note: '[beta] ', gender: 'male', shortCode: 'pmg', code: 'ga_CO_pmc_exthts', dialect: 'CO', algorithm: 'hts'},
 * {api: 'api2', note: '[beta] ', gender: 'female', shortCode: 'snc', code: 'ga_CO_snc_exthts', dialect: 'CO', algorithm: 'hts'},
 * {api: 'api2', note: '[beta] ', gender: 'male',   shortCode: 'cmg', code: 'ga_MU_cmg_exthts', dialect: 'MU', algorithm: 'hts'},
 * {api: 'api2', note: '[beta] ', gender: 'female', shortCode: 'nnc', code: 'ga_MU_nnc_exthts', dialect: 'MU', algorithm: 'hts'},
 *
 * {api: 'nemo', note: '', gender: 'male',   shortCode: '???', code: '????' dialect: 'UL', algorithm: 'multidialect'},
 * {api: 'nemo', note: '[beta] ', gender: 'female', shortCode: 'anb', code: 'anb.multidialect', dialect: 'UL', algorithm: 'multidialect'},
 * {api: 'nemo', note: '[beta] ', gender: 'male', shortCode: 'pmg', code: 'pmg.multidialect', dialect: 'CO', algorithm: 'multidialect'},
 * {api: 'nemo', note: '[beta] ', gender: 'female', shortCode: 'snc', code: 'snc.multidialect', dialect: 'CO', algorithm: 'multidialect'},
 * {api: 'nemo', note: '[beta] ', gender: 'female', shortCode: 'nnc', code: 'nnc.multidialect', dialect: 'MU', algorithm: 'multidialect'},
 * {api: 'nemo', note: '[beta] ', gender: 'female', shortCode: 'roisin', code: 'roisin.multidialect', dialect: 'CO', algorithm: 'multidialect'},
 */

/**
 * Additional voiceCode options for the ApiOptions variable
 * 
 * api2:
 *    "ga_UL_anb_exthts",
 *    "ga_CO_pmc_exthts",
      "ga_CO_pmc_exthts-WORLD",
      "ga_CO_pmg_nemo",
      "ga_CO_snc_exthts",
      "ga_CO_snc_exthts-WORLD",
      "ga_CO_snc_exthts-WORLD-44-48",
      "ga_CO_snc_exthts-WORLD-44-48-full",
      "ga_MU_nnc_exthts",
      "ga_MU_cmg_nemo"

  * nemo:
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
 */

/**
 * Depricated function -> voice code from dialect
 * 
 * // api2_voice_from_dialect(dialect: 'connemara' | 'kerry' | 'donegal'): typeof ApiOptions.api2.voiceCode[number] {
  //   switch (dialect) {
  //     case 'connemara':
  //       return 'ga_CO_pmg_nemo';
  //     case 'kerry':
  //       return 'ga_MU_nnc_nemo';
  //     default: // donegal
  //       return 'ga_UL_anb_nemo';
  //   }
  // }
 */

/**
   * Depricated function -> synthesise from HTML
   *   // synthesiseHtml(input: string, ...theRest): Observable<any> {
  //   input = this.textProcessor.convertHtmlToPlainText(input);
  //   return this.synthesiseText(input, ...theRest );
  // }
   */
