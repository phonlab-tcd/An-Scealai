import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input } from "@angular/core";
import { TranslationService } from "app/core/services/translation.service";
import { SynthVoiceSelectComponent } from "app/student/synth-voice-select/synth-voice-select.component";
import { Voice, VoiceCode, } from "app/core/services/synthesis.service";
import { TextProcessingService } from "app/core/services/text-processing.service";


@Component({
  selector: "app-synthesis-drawer",
  templateUrl: "./synthesis-drawer.component.html",
  styleUrls: ["./synthesis-drawer.component.scss"],
})
export class SynthesisDrawerComponent implements OnInit {
  @Output() closeSynthesisEmitter = new EventEmitter();
  @Output() selectedVoice = new EventEmitter<VoiceCode>();
  @Output() selectedSpeed = new EventEmitter<Number>();
  @ViewChild("voiceSelect") voiceSelect: ElementRef<SynthVoiceSelectComponent>;
  @Input() storyText: string;
  audioLoaded: boolean = true;
  audioSpeeds: number[] = [0.2, 0.5, 0.8, 1, 1.2, 1.5, 1.8, 2];
  audioSelectionIndex: number = 3;
  playbackSpeed: number = this.audioSpeeds[this.audioSelectionIndex];

  constructor(public ts: TranslationService, private textProcessor: TextProcessingService,) {}

  ngOnInit(): void {}

  /**
   * Send selected voice preference to dashboard for synthesis
   * @param voice voice selected from dropdown menu
   */
  setVoice(voice: Voice) {
    this.selectedVoice.emit(voice.code);
  }

  /**
   * Increase or decrease synthesis speed
   * @param incrementDirection +1 for increase, -1 for decrease
   */
  changeVoiceSpeed(incrementDirection: number) {
    if (incrementDirection > 0 && this.audioSelectionIndex < this.audioSpeeds.length - 1) {
      this.audioSelectionIndex++;
    }
    if (incrementDirection < 0 && this.audioSelectionIndex > 0) {
      this.audioSelectionIndex--;
    }
    this.playbackSpeed = this.audioSpeeds[this.audioSelectionIndex]
    this.selectedSpeed.emit(this.playbackSpeed)
  }

  synthesisUrl(input: string, voice: string) {
    const outputType = "JSON";
    const timing = "WORD";
    const params = new URLSearchParams({input, voice, outputType, timing});
    return `https://www.abair.ie/api2/synthesise?${params}` 
  }

  async fetch_cached(url: string) {
    const p = fetch(url).then(r=>r.json());
    return p;
  }



  async fetchAudioData(url: string): Promise<string> {
    const response = await this.fetch_cached(this.synthesisUrl(url, "ga_UL_anb_nemo"));
    return response.audioContent;
  }
  

    isPlaying: boolean = false;
    audioQueue: string[] = [];
  
    playAudio(audioData) {
      return new Promise(resolve => {      
        const audio = new Audio(`data:audio/ogg;base64,${audioData}`);
        audio.play();
          audio.onended = () => {
          console.log("audio finished playing")
          resolve(null);
        };
      });
    }
  
    async getAudio(url) {
      const audioData = await this.fetchAudioData(url);
      console.log("got audio data")
      return audioData;
    }


    async test6() {
      const sentences = this.textProcessor.sentences(this.storyText)
      console.log(sentences);
      //const sentences = ["sentence1", "my my my", "sentence3", "this is a relly long sentence that should take a lot of time to synthesise"]
      for (const sentence of sentences) {
        this.playOrQueueAudio(await this.getAudio(sentence));
      } 
    }

    playOrQueueAudio(audioData) {
      if (this.isPlaying) {
        this.audioQueue.push(audioData);
      }
      else {
        const audio = new Audio(`data:audio/ogg;base64,${audioData}`);
        audio.play();
        this.isPlaying = true;
          audio.onended = () => {
            this.isPlaying = false;
            console.log("audio finished playing");
            const nextAudio = this.audioQueue.shift();
            if (nextAudio) this.playOrQueueAudio(nextAudio)
        };
      }
    }

  



}
