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
  @ViewChild("voiceSelect") voiceSelect: ElementRef<SynthVoiceSelectComponent>;
  playbackSpeed: number = 1; //Shoud range from 0.5x to 2x speed incrementing in 0.5.
  audioLoaded: boolean = true;

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
   * @param increment selected voice speed level
   */
  changeVoiceSpeed(increment: number) {
    if (increment > 0 && this.playbackSpeed < 2) {
      this.playbackSpeed += 0.5;
    }
    if (increment < 0 && this.playbackSpeed > 0.5) {
      this.playbackSpeed -= 0.5;
    }
  }
}
