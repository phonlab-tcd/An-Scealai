import { SynthesisService, voices as synthVoices, Voice } from 'app/core/services/synthesis.service';
import { Subscription } from 'rxjs';

export class SynthItem {
  audioUrl: string | undefined = undefined;
  timing: {word: string, end: number, originalWord: string}[] | undefined = undefined;
  subscription: Subscription;
  id: string = "";
  exceptions: object[] = [];
  constructor(
    public text: string,
    public voice: Voice = synthVoices[0],
    private synth: SynthesisService,
  ){ this.refresh() }

  refresh(useCache = true) {
    this.audioUrl = undefined;
    this.id = this.synth.createCacheId(this.text, this.voice.code, 1);
    this.subscription = this.synth
      .synthesiseText(this.text, this.voice, useCache)
      .subscribe({
        next: data => {console.log(data); this.audioUrl = data.audioUrl; this.timing = data.timing},
        error: error=>   {console.error(error); this.exceptions += error}
      });
  }

  dispose() { this.subscription.unsubscribe() }
}
