import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { SynthesisService } from "app/core/services/synthesis.service";
import { SynthesisCacheService } from "app/core/services/synthesis-cache.service";
import { SynthItem } from 'app/core/models/synth-item';
import { EngagementService } from 'app/core/services/engagement.service';


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
  @Input('playbackSpeed') speed: number;

  constructor(
    private synth: SynthesisService,
    private synthCache: SynthesisCacheService,
    private engagement: EngagementService,
  ) { this.speed = 1;}

  /**
   * Play the synthesised audio of the synth item
   */
  play() {
    this.setPlaybackSpeed()
    if(this.audioElement.nativeElement) {
      this.audioElement.nativeElement.play()
    }
    this.engagement.addPlaySynthesisEvent(this.synthItem.voice.toString(), this.synthItem.text, this.speed);
  }

  /**
   * Set the audio speed for the audio HTML element
   */
  setPlaybackSpeed(){
    if(this.speed != undefined){
    this.audioElement.nativeElement.playbackRate = this.speed;
    } else {
      this.audioElement.nativeElement.playbackRate = 1;
    }
  }

  /**
   * Delete the synth item from cache and re-synthesise
   */
  public refresh() {
    this.synthCache.remove(this.synthItem.id);
    this.synthItem = new SynthItem(this.synthItem.text, this.synthItem.voice, this.synth);
  }

  /**
   * Used to select the background colour of the synth item --> DEPRICATED
   * @param i index of synth item (in relation to parent)
   * @returns css class determined by index
   */
  alternateColors(i: number): string {
    const k = i%8;
    if (k > 3) {
      return 'b'+(4-k%4);
    }
    return 'b'+ k;
  }

  /**
   * Checks if the synthItem and its url exist --> Not used?
   * @returns true or false
   */
  ready() {
    return !!this.synthItem && !!this.synthItem.audioUrl;
  }
}