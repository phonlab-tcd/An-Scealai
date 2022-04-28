import {
  Component,
  Input,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
  SimpleChanges } from '@angular/core';
import { SynthesisService, Dialect } from "../services/synthesis.service";
import { SynthesisBankService } from "app/services/synthesis-bank.service";
import { SynthItem } from 'app/synth-item';
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
    private synth_bank: SynthesisBankService,
    private cdref: ChangeDetectorRef
  ) {}

  play() {
    if(this.audioElement.nativeElement) {
      this.audioElement.nativeElement.play()
    }
  }

  public refresh() {
    this.synth_bank.remove(this.synthItem.requestUrl);
    this.synthItem = new SynthItem(this.synthItem.text,this.synthItem.dialect,this.synth);
  }

  alternateColors(i: number): string {
    const k = i%8;
    if (k > 3) {
      return 'b'+(4-k%4);
    }
    return 'b'+ k;
  }

  ready() {
    return !!this.synthItem.audioUrl;
  }
}
