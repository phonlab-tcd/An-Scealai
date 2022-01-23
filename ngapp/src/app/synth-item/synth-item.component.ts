import { Component, OnInit, Input, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { SynthesisService, Dialect } from "../services/synthesis.service";

@Component({
  selector: 'app-synth-item',
  templateUrl: './synth-item.component.html',
  styleUrls: ['./synth-item.component.css']
})
export class SynthItemComponent implements AfterViewInit {

  @Input('raw_text') raw_text: string;
  @Input('dialect') dialect: string;
  @ViewChild('audioElement') audioElement;

  url: string = undefined;
  constructor(
    private synth: SynthesisService,
    private cdref: ChangeDetectorRef ) { }

  ngAfterViewInit(): void {
    this.synth
      .synthesiseText(
        this.raw_text,
        this.dialect as Dialect )
      .subscribe((audioUrl) => {
        this.url = audioUrl
        this.cdref.detectChanges();
      });
  }

  play() {
    console.dir(this.audioElement)
    if(this.audioElement) {
      this.audioElement.nativeElement.play()
    }
  }
}
