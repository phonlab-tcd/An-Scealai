import { Component, OnInit, Input } from '@angular/core';
import { TextProcessingService } from 'src/app/services/text-processing.service';
import { Dialect, SynthesisService } from 'src/app/services/synthesis.service';
import { SynthesisBankService } from 'src/app/services/synthesis-bank.service';
import { Subscription } from 'rxjs';

type SentenceAndAudioUrl = {
  sentence: string;
  waiting: boolean;
  audioUrl: string;
  subscription?: Subscription;
};

@Component({
  selector: 'app-synthesis-player',
  templateUrl: './synthesis-player.component.html',
  styleUrls: ['./synthesis-player.component.css']
})
export class SynthesisPlayerComponent implements OnInit {
  creationDate: Date;

  sentencesAndAudioUrls: SentenceAndAudioUrl[] = [];

  storedUrls = {};

  @Input() sentences: string[];
  @Input() dialect: Dialect;

  constructor(
    private synth: SynthesisService,
    private synthBank: SynthesisBankService,
    ) { }

  ngOnInit(): void {
    console.count('SYNTHESIS PLAYER COMPONENT CREATED');
    this.synthesiseMySentences();
  }

  refresh() {
    this.unsubscribeAll(this.sentencesAndAudioUrls);
    this.synthesiseMySentences();
  }

  unsubscribeAll(oldSentencesAndUrls: SentenceAndAudioUrl[]) {
    for (const old of oldSentencesAndUrls) {
      old.subscription?.unsubscribe();
    }
  }

  synthesiseMySentences(): void {
    this.sentencesAndAudioUrls = [];
    for (const sentence of this.sentences) {
      const newAudio = {
        sentence,
        waiting: true,
        audioUrl: null,
      } as SentenceAndAudioUrl;

      this.sentencesAndAudioUrls.push(newAudio);

      /*
      const sentenceKey = this.synthBank
            .generateKey(
                sentence,
                this.dialect as Dialect,
                'MP3');

      const storedUrl =
        this.storedUrls[sentenceKey];

      if (storedUrl) {
        newAudio.audioUrl = storedUrl;
        newAudio.waiting = false;
        continue;
      }
      */

      newAudio.subscription =
        this.synth
            .synthesiseText(
              sentence,
              this.dialect as Dialect)
            .subscribe(
              (audioUrl) => {
                newAudio.audioUrl = audioUrl;
                newAudio.waiting = false;
              });
    }
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
