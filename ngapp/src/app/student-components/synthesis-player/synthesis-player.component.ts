import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { TextProcessingService } from 'src/app/services/text-processing.service';
import { SynthesisService, Dialect } from 'src/app/services/synthesis.service';
import { SynthItem } from 'src/app/synth-item';
import { TranslationService } from "src/app/translation.service";

@Component({
  selector: 'app-synthesis-player',
  templateUrl: './synthesis-player.component.html',
  styleUrls: [
    './synthesis-player.component.css',
    '../../app.component.css',
   ]
})
export class SynthesisPlayerComponent implements OnInit {
  hideEntireSynthesisPlayer = true;
  synthItems: SynthItem[] = [];
  
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
    return new SynthItem(line,this.dialect,this.synth);
  }

  refresh() {
    this.synthItems.map(s=>{
      s.audioUrl = undefined;
      s.dispose();
    })
    setTimeout(()=>{
      this.synthItems =
        this.textProcessor
            .sentences(this.text)
        .map(l=>new SynthItem(l, this.dialect, this.synth));
      this.cdref.detectChanges();
    },50);
  }

  goToFastSynthesiser() {
    this.router.navigateByUrl('/synthesis/' + this.storyId);
  }
}
