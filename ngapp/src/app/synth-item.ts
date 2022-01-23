import { SynthesisService, Dialect } from 'src/app/services/synthesis.service';
import { Subscription } from 'rxjs';

export class SynthItem {
  text: string;
  dialect: Dialect;
  url: string = undefined;
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
    this.requestUrl = synth.url(this.text,this.dialect);
    this.subscription = this.synth
      .synthesiseText(
        this.text,
        this.dialect)
      .subscribe((audioUrl) => {
        console.log('GOT RESPONSE FOR', this.text);
        this.url = audioUrl
        console.log('THIS URL', this.url);
        this.audio = new Audio(this.url);
      });
  }

  dispose() {
    this.subscription.unsubscribe();
  }
}
