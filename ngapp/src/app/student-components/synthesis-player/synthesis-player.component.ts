import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { TextProcessingService } from 'app/services/text-processing.service';
import { VoiceCode, ApiOptions as SynthApiOptions, SynthesisService, Dialect, voices, Voice } from 'app/services/synthesis.service';
import { SynthItem } from 'app/synth-item';
import { TranslationService } from 'app/translation.service';
import { voices as synthVoices, pseudonym } from 'app/services/synthesis.service';
import { MatSelect } from '@angular/material/select';
import { SynthVoiceSelectComponent } from 'app/synth-voice-select/synth-voice-select.component';

@Component({
  selector: 'app-synthesis-player',
  templateUrl: './synthesis-player.component.html',
  styleUrls: [
    './synthesis-player.component.scss',
    // '../../app.component.scss',
   ]
})
export class SynthesisPlayerComponent implements OnInit {
  hideEntireSynthesisPlayer = true;
  synthItems: SynthItem[] = [];
  pseudonym = pseudonym;

  @Input() storyId: string;
  @Input() text: string;
  @ViewChild('voiceSelect') voiceSelect: ElementRef<SynthVoiceSelectComponent>;

  selected: Voice;

  toggleHidden() {
    this.hideEntireSynthesisPlayer = !this.hideEntireSynthesisPlayer;
    this.refresh();
  }

  constructor(
    private router: Router,
    private textProcessor: TextProcessingService,
    private cdref: ChangeDetectorRef,
    private synth: SynthesisService,
    public ts: TranslationService
    ) { }

  ngOnInit() { this.refresh() }

  getSynthItem(line: string) {
    return new SynthItem(line,this.selected,this.synth);
  }

  refresh(voice: Voice = undefined) {
    if(voice) this.selected = voice;
    this.synthItems.map(s=>{
      s.audioUrl = undefined;
      s.dispose();
    })
    // setTimeout is just for juice (Neimhin Fri 28 Jan 2022 23:19:46)
    if(!this.text) return;
    setTimeout(()=>{
      this.synthItems =
        this.textProcessor
            .sentences(this.text)
        .map(l=>this.getSynthItem(l));
      this.cdref.detectChanges();
    },50);
  }

  goToFastSynthesiser() {
    this.router.navigateByUrl('/synthesis/' + this.storyId);
  }
}
