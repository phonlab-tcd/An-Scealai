import {
  Component,
  Input,
  ViewChild,
  ElementRef} from '@angular/core';
import { SynthService } from "../synth.service";
import { SynthBankService } from "../synth-bank.service";
import { SynthItem } from '../synth-item';
import { EngagementService } from 'app/engagement.service';

@Component({
  selector: 'app-synth-item',
  templateUrl: './synth-item.component.html',
  styleUrls: ['./synth-item.component.scss']
})
export class SynthItemComponent {

  @Input('synthItem') synthItem: SynthItem;
  @Input() storyId: string;
  @Input('i') i: number = 0;
  @ViewChild('audioElement') audioElement: ElementRef<HTMLAudioElement>;

  constructor(
    private synth: SynthService,
    private synth_bank: SynthBankService,
    private engagement: EngagementService,
  ) {}

  play() {
    if(this.audioElement.nativeElement) {
      this.audioElement.nativeElement.play()
    }
    this.engagement.playSynthesis(this.synthItem, this.storyId);
  }

  public refresh() {
    this.synth_bank.remove(this.synthItem.requestUrl);
    this.synthItem = new SynthItem(this.synthItem.text,this.synthItem.voice,this.synth);
  }

  alternateColors(i: number): string {
    const k = i%8;
    if (k > 3) {
      return 'b'+(4-k%4);
    }
    return 'b'+ k;
  }

  ready() {
    return !!this.synthItem && !!this.synthItem.audioUrl;
  }
}
