import { Component, Input, ViewChild, ElementRef} from '@angular/core';
import { SynthesisService } from "../services/synthesis.service";
import { SynthesisBankService } from "app/services/synthesis-bank.service";
import { SynthItem } from 'app/synth-item';
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
  @Input('playbackSpeed') speed?: number;

  constructor(
    private synth: SynthesisService,
    private synth_bank: SynthesisBankService,
    private engagement: EngagementService,
  ) {}

  play() {
    this.setPlaybackSpeed()
    if(this.audioElement.nativeElement) {
      this.audioElement.nativeElement.play()
    }
    this.engagement.playSynthesis(this.synthItem, this.storyId);
  }

  setPlaybackSpeed(){
    if(this.speed != undefined){
    this.audioElement.nativeElement.playbackRate = this.speed;
    } else {
      this.audioElement.nativeElement.playbackRate = 1;
    }
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
