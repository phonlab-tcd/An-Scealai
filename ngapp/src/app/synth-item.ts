import { ApiOptions as SynthApiOptions, SynthesisService, VoiceCode, voices as synthVoices, Voice } from 'app/services/synthesis.service';
import { Subscription } from 'rxjs';

export class SynthItem {
  audioUrl: string = undefined;
  subscription: Subscription
  requestUrl: string;
  exceptions: object[] = [];
  constructor(
    public text: string,
    public voice: Voice = synthVoices[0],
    private synth: SynthesisService,
  ){ this.refresh() }

  refresh(useCache = true) {
    this.audioUrl = undefined;
    this.requestUrl = this.synth.request_url(this.text,this.voice);
    this.subscription = this.synth
      .synthesiseText(this.text,this.voice, useCache)
      .subscribe(
        audioUrl=>this.audioUrl = audioUrl,
        error=>   {console.error(error);this.exceptions += error});
  }

  dispose() { this.subscription.unsubscribe() }
}