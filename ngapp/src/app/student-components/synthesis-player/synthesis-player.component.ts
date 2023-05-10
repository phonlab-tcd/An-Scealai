import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, ElementRef, } from "@angular/core";
import { Router } from "@angular/router";
import { TextProcessingService } from "app/core/services/text-processing.service";
import { SynthesisService, Voice } from "app/core/services/synthesis.service";
import { SynthItem } from "app/core/models/synth-item";
import { TranslationService } from "app/core/services/translation.service";
import { SynthVoiceSelectComponent } from "app/synth-voice-select/synth-voice-select.component";

//------------------------------ Audio Check Component On Dashboard ----------------------------//

@Component({
  selector: "app-synthesis-player",
  templateUrl: "./synthesis-player.component.html",
  styleUrls: [
    "./synthesis-player.component.scss",
    // '../../app.component.scss',
  ],
})
export class SynthesisPlayerComponent implements OnInit {
  hideEntireSynthesisPlayer = true;
  synthItems: SynthItem[] = [];
  allAudioSources: any = [];
  audio;
  blobUrl;

  @Input() storyId: string;
  @Input() text: string;
  @Input() storyTitle: string;
  @ViewChild("voiceSelect") voiceSelect: ElementRef<SynthVoiceSelectComponent>;

  selected: Voice;

  constructor(
    private router: Router,
    private textProcessor: TextProcessingService,
    private cdref: ChangeDetectorRef,
    private synth: SynthesisService,
    public ts: TranslationService
  ) {}

  ngOnInit() {
    this.refresh();
  }

  /**
   * Delete the data of any synth items and reprocess the story for synthesis
   * @param voice
   */
  refresh(voice: Voice = undefined) {
    if (voice) this.selected = voice;
    // remove any synth item audio data
    this.synthItems.map((s) => {
      s.audioUrl = undefined;
      s.dispose();
    });
    // setTimeout is just for juice (Neimhin Fri 28 Jan 2022 23:19:46)
    if (!this.text) return;
    setTimeout(() => {
      // process the story text into sentences and create new synth items for each sentence
      this.synthItems = this.textProcessor
        .sentences(this.text)
        .map((l) => this.getSynthItem(l));
      this.cdref.detectChanges();
      this.audio = null;
    }, 50);
  }

  /**
   * Create a new synth item from a line of story text
   * @param line sentence from story text
   * @returns new synth item from sentence
   */
  getSynthItem(line: string) {
    return new SynthItem(line, this.selected, this.synth);
  }

  /**
   * Check if all the synth items' audio have loaded (i.e. they have an audioUrl)
   * @returns true if all items are loaded, otherwise false
   */
  audioLoaded(): boolean {
    return this.synthItems.every(
      (element) =>
        element.audioUrl != undefined || element.exceptions.length > 0
    );
  }

  /**
   * If combined audio exists, play it; otherwise create it first
   */
  async combineAndPlayAudio() {
    if (!this.audio) {
      await this.combineAudioSources();
    }
    this.playAllAudio();
  }

  /**
   * Combine the audio URLs of all synth items so the story can be played in one go
   */
  async combineAudioSources() {
    this.allAudioSources = this.synthItems.map((item) => item.audioUrl);
    let proms = this.allAudioSources.map((uri) =>
      fetch(uri).then((r) => r.blob())
    );
    await Promise.all(proms).then((blobs) => {
      let blob = new Blob(blobs);
      this.blobUrl = URL.createObjectURL(blob);
      this.audio = new Audio(this.blobUrl);
    });
  }

  /**
   * Play all audio or stop and reset if already playing
   */
  playAllAudio() {
    if (this.audio.paused) {
      this.audio.play();
    } else {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

  /**
   * Download synthesised story as mp3
   */
  async downloadAudio() {
    if (!this.audio) {
      await this.combineAudioSources();
    }
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = this.blobUrl;
    a.download = this.storyTitle + ".mp3";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(this.blobUrl);
  }

  /**
   * route to the HTS synthesiser
   */
  goToFastSynthesiser() {
    this.router.navigateByUrl("/synthesis/" + this.storyId);
  }

  /**
   * Stop playing all the synth items
   */
  stopSynthesis() {
    this.synthItems.map((s) => {
      s.audioUrl = undefined;
      s.dispose();
    });
  }

  /**
   * Toggle the synth player and refresh the audio
   */
  toggleHidden() {
    this.hideEntireSynthesisPlayer = !this.hideEntireSynthesisPlayer;
    this.refresh();
  }
}
