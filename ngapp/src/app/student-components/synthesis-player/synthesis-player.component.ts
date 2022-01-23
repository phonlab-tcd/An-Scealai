import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { TextProcessingService } from 'src/app/services/text-processing.service';
import { SynthesisService, Dialect } from 'src/app/services/synthesis.service';
import { SynthItem } from 'src/app/synth-item';

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
  lines: string[] = [];
  synthItems: SynthItem[] = [];
  
  @Input() storyId: string;
  @Input() text: string;
  @Input() dialect: Dialect;

  constructor(
    private router: Router,
    public textProcessor: TextProcessingService,
    private cdref: ChangeDetectorRef,
    private synth: SynthesisService,
    ) { }

  ngOnInit(): void {
    this.refresh();
  }

  alternateColors(i: number): string {
    return 'b'+ i%3;
  }

  async check() {
    for(const si of this.synthItems) {
      for(const si2 of this.synthItems) {
        if(si.text !== si2.text && si.url === si2.url) {
          console.log('WEIRD');
          console.dir(si.text);
          console.dir(si2.text);
        }
      }
    }

    for(const key of Object.keys(sessionStorage)){
      for(const key2 of Object.keys(sessionStorage)){
        if (key !== key2 && sessionStorage[key] === sessionStorage[key2]) {
          console.count('WEIRD SESSION STORAGE');
          console.dir(key);
          console.dir(key2);
        }
      }
    }
  }

  getSynthItem(line: string) {
    return new SynthItem(line,this.dialect,this.synth);
  }

  refresh() {
    this.lines = this.textProcessor.sentences(this.text);
    this.synthItems = this.lines.map(l=>{
      console.log('CREATING SYNTH ITME FOR', ''+l);
      return new SynthItem(''+l, this.dialect, this.synth);
    });
    this.cdref.detectChanges();
    console.log('NUMBER OF SYNTH ITEMS:', this.synthItems.length);
  }

  goToFastSynthesiser() {
    this.router.navigateByUrl('/synthesis/' + this.storyId);
  }
}
