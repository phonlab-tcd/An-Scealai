import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input, } from "@angular/core";
import { TranslationService } from "app/core/services/translation.service";
import { SynthVoiceSelectComponent } from "app/student/synth-voice-select/synth-voice-select.component";
import { Voice, VoiceCode } from "app/core/services/synthesis.service";
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
  selectedVoiceCode: VoiceCode;
  audio: HTMLAudioElement = null;
  isHittingAPI: boolean = true;
  isPlaying: boolean = false;
  audioQueue: string[] = [];

  constructor(
    public ts: TranslationService,
    private textProcessor: TextProcessingService
  ) {}

  ngOnInit(): void {}

  /**
   * Send selected voice preference to dashboard for synthesis
   * @param voice voice selected from dropdown menu
   */
  setVoice(voice: Voice) {
    this.selectedVoiceCode = voice.code;
    this.selectedVoice.emit(this.selectedVoiceCode);
  }

  /**
   * Increase or decrease synthesis speed
   * @param incrementDirection +1 for increase, -1 for decrease
   */
  changeVoiceSpeed(incrementDirection: number) {
    if (
      incrementDirection > 0 &&
      this.audioSelectionIndex < this.audioSpeeds.length - 1
    ) {
      this.audioSelectionIndex++;
    }
    if (incrementDirection < 0 && this.audioSelectionIndex > 0) {
      this.audioSelectionIndex--;
    }
    this.playbackSpeed = this.audioSpeeds[this.audioSelectionIndex];
    this.selectedSpeed.emit(this.playbackSpeed);
  }

  closeDrawer() {
    this.resetAudio();
    this.closeSynthesisEmitter.next(true);
  }

  resetAudio() {
    this.isHittingAPI = false;
    if (this.audio) this.audio.pause();
    this.audio = null;
    this.isPlaying = false;
    this.audioQueue = [];
  }

  /* Parse story text and synthesise each sentence if no audio, otherwise toggle play/pause */
  playAllAudio() {
    if (!this.audio) {
      this.audioLoaded = false;
      this.isHittingAPI = true;
      this.parseTextAndGetAudio();
    } else {
      this.toggleAudioPlayback();
    }
  }

  /* Play audio if paused, pause if playing */
  toggleAudioPlayback() {
    if (this.audio.paused) {
      this.audio.play();
    } else {
      this.audio.pause();
      //this.audio.currentTime = 0; // or set audio to null to restart?
    }
  }

  /* For each sentence, synthesise the text and add the audio to a queue for playing */
  async parseTextAndGetAudio() {
    const sentences = this.textProcessor.sentences(this.storyText);
    for (const sentence of sentences) {
      if (!this.isHittingAPI) 
        return;
      this.queueAudio(await this.getAudio(sentence));
    }
  }

  /* Add audio to queue if current track is playing, otherwise play audio */
  queueAudio(audioData) {
    if (this.isPlaying) {
      this.audioQueue.push(audioData);
    } else {
      this.playAudio(audioData);
    }
  }

  /* Play audio, enqueue the next one once the audio has finished */
  playAudio(audioData) {
    this.audio = new Audio(`data:audio/ogg;base64,${audioData}`);
    this.audioLoaded = true;
    this.audio.play();
    this.isPlaying = true;
    this.audio.onended = () => {
      this.isPlaying = false;
      const nextAudio = this.audioQueue.shift();
      if (nextAudio) this.queueAudio(nextAudio);
    };
  }

  async getAudio(url) {
    const audioData = await this.fetchAudioData(url);
    return audioData;
  }

  async fetchAudioData(url: string) {
    const response = await this.fetch_cached( this.synthesisUrl(url, this.selectedVoiceCode) );
    return response.audioContent;
  }

  async fetch_cached(url: string) {
    const p = fetch(url).then((r) => r.json());
    return p;
  }

  /* Create url for synthesise using text and selected voice */
  synthesisUrl(input: string, voice: string) {
    const outputType = "JSON";
    const timing = "WORD";
    const params = new URLSearchParams({ input, voice, outputType, timing });
    return `https://www.abair.ie/api2/synthesise?${params}`;
  }
}
