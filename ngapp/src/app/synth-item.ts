import { ApiOptions as SynthApiOptions, SynthesisService, Voice } from 'app/services/synthesis.service';
import { Subscription } from 'rxjs';

export class SynthItem {
  text: string;
  api: keyof typeof SynthApiOptions;
  voice: Voice;
  audioUrl: string = undefined;
  subscription: Subscription
  requestUrl: string;
  exceptions: object[] = [];
  constructor(
    text: string,
    api: keyof typeof SynthApiOptions,
    voice: Voice,
    private synth: SynthesisService,
  ){
    let validVoices;
    if(api==='nemo') {
      validVoices = SynthApiOptions.nemo.voice;
    } else {
      api = 'api2';
      validVoices = SynthApiOptions.api2.voice;
    }
    if(!(validVoices.includes(voice))) throw new Error(`voice '${voice}' is not a valid voice for api '${api}'`);

    this.text = ''+text;
    this.voice = voice;
    this.api = api;
    this.requestUrl = synth.request_url(this.text,this.api,this.voice);
    this.subscription = this.synth
      .synthesiseText(
        this.text,
	this.api,
        this.voice)
      .subscribe(
        audioUrl=>this.audioUrl = audioUrl,
        error=>   {console.error(error);this.exceptions += error});
  }

  dispose() { this.subscription.unsubscribe() }
}

// export class SynthItemNemo {
//   text: string;
//   voice: typeof Synth.ApiOptions.nemo.voice[number];
//   audioUrl: string = undefined;
//   subscription: Subscription
//   requestUrl: string;
//   exceptions: object[] = [];
//   constructor(
//     text: string,
//     voice: typeof Synth.options.nemo.voice[number],
//     private synth: Synth.SynthesisService,
//   ){
//     this.text = ''+text;
//     this.voice = voice;
//     this.requestUrl = synth.nemo_url(this.text,voice,'mp3');
//     this.subscription = this.synth
//       .synthesiseTextNemo(
//         this.text,
//         this.voice)
//       .subscribe(
//         audioUrl=>this.audioUrl = audioUrl,
//         error=>   this.exceptions += error);
//   }
//   dispose() { this.subscription.unsubscribe() }
// }
