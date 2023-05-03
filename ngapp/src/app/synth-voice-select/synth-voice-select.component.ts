import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Voice, voices, pseudonym } from 'app/services/synthesis.service';
import { TranslationService } from 'app/translation.service';
@Component({
  selector: 'synth-voice-select',
  templateUrl: './synth-voice-select.component.html',
})
export class SynthVoiceSelectComponent implements OnInit{
  constructor(public ts: TranslationService) { }

  voices = voices;
  selected = this.voices[0];
  //pseudonym = pseudonym;

  @Output() selectVoice = new EventEmitter<Voice>();

  ngOnInit(){ this.selectVoice.emit(this.selected) }

  color(gender: 'male'|'female'): string {
    return gender.startsWith('f') ? 'rgba(255, 191, 194)' : 'rgba(194, 218, 255)';
  }
}
