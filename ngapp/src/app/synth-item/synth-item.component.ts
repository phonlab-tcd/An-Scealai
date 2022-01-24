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
}
