import * as Synth from 'app/services/synthesis.service';
import { Subscription } from 'rxjs';

export class SynthItem {
  text: string;
  dialect: Synth.Dialect;
  audioUrl: string = undefined;
  subscription: Subscription
  requestUrl: string;
  exceptions: object[] = [];
  constructor(
    text: string,
    dialect: Synth.Dialect,
    private synth: Synth.SynthesisService,
  ){
    this.text = ''+text;
    this.dialect = ''+dialect as Synth.Dialect;
    this.requestUrl = synth.api2_url(this.text,this.dialect);
    this.subscription = this.synth
      .synthesiseTextApi2(
        this.text,
        this.dialect)
      .subscribe(
        audioUrl=>this.audioUrl = audioUrl,
        error=>   this.exceptions += error);
  }

  dispose() { this.subscription.unsubscribe() }
}

export class SynthItemNemo {
  text: string;
  voice: typeof Synth.options.nemo.voice[number];
  audioUrl: string = undefined;
  subscription: Subscription
  requestUrl: string;
  exceptions: object[] = [];
  constructor(
    text: string,
    voice: typeof Synth.options.nemo.voice[number],
    private synth: Synth.SynthesisService,
  ){
    this.text = ''+text;
    this.voice = voice;
    this.requestUrl = synth.nemo_url(this.text,voice,'mp3');
    this.subscription = this.synth
      .synthesiseTextNemo(
        this.text,
        this.voice)
      .subscribe(
        audioUrl=>this.audioUrl = audioUrl,
        error=>   this.exceptions += error);
  }
  dispose() { this.subscription.unsubscribe() }
}
