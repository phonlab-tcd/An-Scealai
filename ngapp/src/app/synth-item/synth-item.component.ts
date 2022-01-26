import {
  Component,
  Input,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
  SimpleChanges } from '@angular/core';
import { SynthesisService, Dialect } from "../services/synthesis.service";
import { SynthItem } from 'src/app/synth-item';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-synth-item',
  templateUrl: './synth-item.component.html',
  styleUrls: ['./synth-item.component.css']
})
export class SynthItemComponent {

  @Input('synthItem') synthItem: SynthItem;
  @Input('i') i: number;
  @ViewChild('audioElement') audioElement ;

  constructor(
    private synth: SynthesisService,
    private cdref: ChangeDetectorRef
  ) {}

  play() {
    if(this.audioElement.nativeElement) {
      this.audioElement.nativeElement.play()
    }
  }

  refresh() {
    this.synthItem = new SynthItem(this.synthItem.text,this.synthItem.dialect,this.synth);
  }

  alternateColors(i: number): string {
    const k = i%10;
    if (k > 5) {
      return 'b'+(5-k%5);
    }
    return 'b'+ k;
  }

  ready() {
    return !!this.synthItem.audioUrl;
  }
}
