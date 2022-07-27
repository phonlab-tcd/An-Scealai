import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { TextProcessingService } from 'app/services/text-processing.service';
import { VoiceCode, ApiOptions as SynthApiOptions, SynthesisService, Dialect, voices } from 'app/services/synthesis.service';
import { SynthItem } from 'app/synth-item';
import { TranslationService } from 'app/translation.service';
import { voices as synthVoices, pseudonym } from 'app/services/synthesis.service';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-synthesis-player',
  templateUrl: './synthesis-player.component.html',
  styleUrls: [
    './synthesis-player.component.scss',
    '../../app.component.scss',
   ]
})
export class SynthesisPlayerComponent implements OnInit, AfterViewInit {
  hideEntireSynthesisPlayer = true;
  synthItems: SynthItem[] = [];
  voice = 'pmg.multidialect';
  pseudonym = pseudonym;

  color(gender: 'male'|'female'): string {
    return gender.startsWith('f') ? 'background-color: rgba(255,0,100,0.4)' : 'background-color: rgba(0,0,255,0.2)';

  }

  voices = synthVoices;
  selected = this.voices[0];
  
  @Input() storyId: string;
  @Input() text: string;
  @Input() dialect: Dialect;
  @ViewChild('select') select: MatSelect;
  


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

  ngOnInit() {
    this.refresh();
  }

  ngAfterViewInit() {
    this.select.selectionChange.subscribe(()=>this.refresh());
  }

  getSynthItem(line: string) {
    return new SynthItem(line,this.selected.api as 'api2'|'nemo',this.selected.code,this.synth);
  }

  refresh() {
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
