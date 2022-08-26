import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { TextProcessingService } from 'app/services/text-processing.service';
import { SynthService, Voice, pseudonym } from '../synth.service';
import { SynthItem } from '../synth-item';
import { TranslationService } from '../../translation.service';
import { SynthVoiceSelectComponent } from "../synth-voice-select/synth-voice-select.component";

@Component({
  selector: 'app-synthesis-player',
  templateUrl: "./component.html",
  styleUrls: [
    "./component.scss",
    // '../../app.component.scss',
   ]
})
export class SynthPlayerComponent implements OnInit {
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
    private synth: SynthService,
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
