import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { TextProcessingService } from 'app/services/text-processing.service';
import { Voice, ApiOptions as SynthApiOptions, SynthesisService, Dialect } from 'app/services/synthesis.service';
import { SynthItem } from 'app/synth-item';
import { TranslationService } from "app/translation.service";

@Component({
  selector: 'app-synthesis-player',
  templateUrl: './synthesis-player.component.html',
  styleUrls: [
    './synthesis-player.component.scss',
    '../../app.component.scss',
   ]
})
export class SynthesisPlayerComponent implements OnInit {
  hideEntireSynthesisPlayer = true;
  synthItems: SynthItem[] = [];
  voice = 'pmg.multidialect';

  voices = [
    ...SynthApiOptions.api2.voice.map(v=>({voice: v, api: 'api2'})),
    ...SynthApiOptions.nemo.voice.map(v=>({voice: v, api: 'nemo'}))
  ] as [{voice: Voice, api: keyof typeof SynthApiOptions}];
  selected = this.voices[0];
  
  @Input() storyId: string;
  @Input() text: string;
  @Input() dialect: Dialect;


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

  ngOnInit(): void {
    this.refresh();
  }

  getSynthItem(line: string) {
    return new SynthItem(line,this.selected.api as 'api2'|'nemo',this.selected.voice,this.synth);
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
        .map(l=>new SynthItem(l, this.selected.api as 'api2'|'nemo', this.selected.voice, this.synth));
      this.cdref.detectChanges();
    },50);
  }

  goToFastSynthesiser() {
    this.router.navigateByUrl('/synthesis/' + this.storyId);
  }
}
