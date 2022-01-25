import { SynthesisService, Dialect } from 'src/app/services/synthesis.service';
import { Subscription } from 'rxjs';

export class SynthItem {
  text: string;
  dialect: Dialect;
  audioUrl: string = undefined;
  subscription: Subscription
  requestUrl: string;
  audio: HTMLAudioElement;
  constructor(
    text: string,
    dialect: Dialect,
    private synth: SynthesisService,
  ){
    this.text = ''+text;
    this.dialect = ''+dialect as Dialect;
    this.requestUrl = synth.api2_url(this.text,this.dialect);
    this.subscription = this.synth
      .synthesiseText(
        this.text,
        this.dialect)
      .subscribe((audioUrl) => {
        this.audioUrl = audioUrl
        this.audio = new Audio(this.audioUrl);
      });
  }

  dispose() {
    this.subscription.unsubscribe();
  }
}
