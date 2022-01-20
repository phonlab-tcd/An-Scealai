import { Component, OnInit, Input, ViewChildren } from '@angular/core';
import { TextProcessingService } from 'src/app/services/text-processing.service';
import { Dialect, SynthesisService } from 'src/app/services/synthesis.service';
import { SynthesisBankService } from 'src/app/services/synthesis-bank.service';
import { Subscription } from 'rxjs';
import {
  Router,
} from '@angular/router';

@Component({
  selector: 'app-synthesis-player',
  templateUrl: './synthesis-player.component.html',
  styleUrls: [
    './synthesis-player.component.css',
    '../../app.component.css',
   ]
})
export class SynthesisPlayerComponent implements OnInit {
  creationDate: Date;
  hideEntireSynthesisPlayer = true;

  audioUrl: string;
  subscription: Subscription;
  lines: string[] = [];
  audioBuffers: {
    // source: AudioBufferSourceNode;
    // buffer: AudioBuffer;
    url: string;
    // audioElement: any; // TODO
    // audioContext: AudioContext;
    subscription: Subscription}[] = [];

  @ViewChildren('audioElements') audioElements;
  
  @Input() storyId: string;
  @Input() text: string;
  @Input() dialect: Dialect;

  constructor(
    private synth: SynthesisService,
    private synthBank: SynthesisBankService,
    private router: Router,
    private textProcessor: TextProcessingService,
    ) { }

  ngOnInit(): void {
    this.synthesiseText();
  }

  alternateColors(i: number): string {
    return 'b'+ i%3;
  }

  refresh() {
    this.synthesiseText();
  }

  play(i: number) {
    console.log(i);
    console.log(
      this.audioElements[i]
    );

  }

  goToFastSynthesiser() {
    this.router.navigateByUrl('/synthesis/' + this.storyId);
  }

  splitTextIntoLines() {
    for (const buf of this.audioBuffers) {
      buf.subscription.unsubscribe();
    }
    this.lines = [];
    this.audioBuffers = [];
    this.textProcessor.sentences(this.text)
      .forEach((sent,i) => {
        console.log(sent);
        this.lines.push(sent);
        const newBuffer = {
          url: null,
          subscription: null,
        };

        newBuffer.subscription = this.synth
              .synthesiseText(
                sent,
                    // .replace(/[\.!?\n]+/g, ' -- ')
                    // .replace(/[\s]+/g, ' '),
                this.dialect as Dialect
              )
              .subscribe((audioUrl) => {
                newBuffer.url = audioUrl;
              });

        this.audioBuffers.push(newBuffer);
      });
  }
 
  rebuildAudioUrl() {
  }

  synthesiseText(): void {
    /*
    this.subscription?.unsubscribe();
    this.subscription =
        this.synth
            .synthesiseText(
              this.text.replace(/[\.!?\n]+/g, ' -- ').replace(/[\s]+/g, ' '),
              this.dialect as Dialect)
            .subscribe(
              (audioData) => {
                this.audioUrl = this.synth.prependAudioUrlPrefix(audioData, 'mp3');
              });
    */

    this.splitTextIntoLines();
  }

  _base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
}

interface SynthesisedSentence {
  url: string;
  sentence: string;
  waiting: boolean;
  subscription: Subscription;
}

type SynthesisSentenceBySentence = {
  date: Date,
  // The synthesised sentences should be in the order they appear in the text.
  // I don't think this can't be enforced with static type checking.
  // (Neimhin Mon 19 July 2021)
  sentences: SynthesisedSentence[],
};

function  synthesiseQuillTextSentenceBySentence(lines: string[]) {

  const sentences: string[] = lines.flatMap(this.textProcessor.sentences);
  const d = this.story.dialect as Dialect;

  const newSynthesis: SynthesisSentenceBySentence = {
    date: new Date(),
    sentences: [],
  };

  for (const sentence of sentences) {

    // BEGIN THE HTTP REQUEST TO SYNTHESISE A NEW SENTENCE
    const thisSentence = {
      url: null,
      sentence,
      waiting: true,
      subscription: this.synth
                        .synthesiseText(sentence, d)
                        .subscribe({
                          next: (url: string) => {
                            thisSentence.url = url;
                            thisSentence.waiting = false;
                          }
                        }),
    } as SynthesisedSentence;
    newSynthesis.sentences.push(thisSentence);

    // IF WE ALREADY HAVE THE SYNTHESIS IN STORAGE, CANCEL THE HTTP REQUEST
    const storageUrl = this.synthBank.getAudioUrlOfSentence(sentence, d, 'MP3');
    if (storageUrl && thisSentence.waiting) {
      thisSentence.subscription.unsubscribe();
      thisSentence.url = storageUrl;
      thisSentence.waiting = false;
      delete thisSentence.subscription;
    }
  }

  this.audioSources.unshift(newSynthesis as SynthesisSentenceBySentence);
  
}
