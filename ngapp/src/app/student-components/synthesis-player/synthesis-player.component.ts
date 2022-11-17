import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { TextProcessingService } from 'app/services/text-processing.service';
import { VoiceCode, ApiOptions as SynthApiOptions, SynthesisService, Dialect, voices, Voice } from 'app/services/synthesis.service';
import { SynthItem } from 'app/synth-item';
import { TranslationService } from 'app/translation.service';
import { voices as synthVoices, pseudonym } from 'app/services/synthesis.service';
import { MatSelect } from '@angular/material/select';
import { SynthVoiceSelectComponent } from 'app/synth-voice-select/synth-voice-select.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-synthesis-player',
  templateUrl: './synthesis-player.component.html',
  styleUrls: [
    './synthesis-player.component.scss',
    // '../../app.component.scss',
   ]
})
export class SynthesisPlayerComponent implements OnInit {
  hideEntireSynthesisPlayer = true;
  synthItems: SynthItem[] = [];
  allAudioSources: any = [];
  pseudonym = pseudonym;
  audio;
  blobUrl

  @Input() storyId: string;
  @Input() text: string;
  @Input() storyTitle: string;
  @ViewChild('voiceSelect') voiceSelect: ElementRef<SynthVoiceSelectComponent>;

  selected: Voice;

  toggleHidden() {
    this.hideEntireSynthesisPlayer = !this.hideEntireSynthesisPlayer;
    this.refresh();
  }

  constructor(
    private router: Router,
    private textProcessor: TextProcessingService,
    private cdref: ChangeDetectorRef,
    private synth: SynthesisService,
    public ts: TranslationService,
    private sanitizer: DomSanitizer
    ) { }

  ngOnInit() { 
    this.refresh();
  }

  getSynthItem(line: string) {
    return new SynthItem(line,this.selected,this.synth);
  }

  refresh(voice: Voice = undefined) {
    if(voice) this.selected = voice;
    this.synthItems.map(s=>{
      s.audioUrl = undefined;
      s.dispose();
    })
    // setTimeout is just for juice (Neimhin Fri 28 Jan 2022 23:19:46)
    if(!this.text) return;
    setTimeout(()=>{
      this.synthItems = this.textProcessor.sentences(this.text).map(l=>this.getSynthItem(l));
      this.cdref.detectChanges();
      this.audio = null;
    },50);
  }
  
  /* check if all synthItems have an audio url */
  audioLoaded():boolean {
    return this.synthItems.every(element => element.audioUrl != undefined || element.exceptions.length > 0);
  }
  
  /* If audio exists, play it; otherwise create it by combining audio urls */
  async combineAndPlayAudio() {
    if(!this.audio) {
      await this.combineAudioSources();
    }
    this.playAllAudio();
  }
  
  /* Combine the audio URLs of all synth items so the story can be played in one go */
  async combineAudioSources() {
    this.allAudioSources = this.synthItems.map(item => item.audioUrl);
    let proms = this.allAudioSources.map(uri => fetch(uri).then(r => r.blob()));
    await Promise.all(proms)
    .then(blobs => {
        let blob = new Blob(blobs);
        this.blobUrl = URL.createObjectURL(blob);
        this.audio = new Audio(this.blobUrl);
    })
  }
  
  /* Play all audio or stop and reset if already playing */
  playAllAudio() {
    if(this.audio.paused) {
      this.audio.play();
    }
    else {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }
  
  /* Download synthesised story as mp3 */
  async downloadAudio() {
    if(!this.audio) {
      await this.combineAudioSources();
    }
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = this.blobUrl;
    a.download = this.storyTitle + '.mp3';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(this.blobUrl);
  }

  goToFastSynthesiser() {
    this.router.navigateByUrl('/synthesis/' + this.storyId);
  }
}
