import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, } from "@angular/core";
import { TranslationService } from "app/core/services/translation.service";
import { SynthVoiceSelectComponent } from "app/student/synth-voice-select/synth-voice-select.component";
import { Voice, VoiceCode, } from "app/core/services/synthesis.service";

@Component({
  selector: "app-synthesis-drawer",
  templateUrl: "./synthesis-drawer.component.html",
  styleUrls: ["./synthesis-drawer.component.scss"],
})
export class SynthesisDrawerComponent implements OnInit {
  @Output() closeSynthesisEmitter = new EventEmitter();
  @Output() selectedVoice = new EventEmitter<VoiceCode>();
  @Output() selectedSpeed = new EventEmitter<number>();
  @ViewChild("voiceSelect") voiceSelect: ElementRef<SynthVoiceSelectComponent>;
  audioLoaded: boolean = true;
  audioSpeeds: number[] = [0.2, 0.5, 0.8, 1, 1.2, 1.5, 1.8, 2];
  audioSelectionIndex: number = 3;
  playbackSpeed: number = this.audioSpeeds[this.audioSelectionIndex];

  constructor(public ts: TranslationService) {}

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
}
