import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { AbairAPIv2AudioEncoding, SynthesisService } from '../../services/synthesis.service';
import { Subject } from 'rxjs';
import { Track } from 'ngx-audio-player';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

type Dialect = 'connemara' | 'kerry' | 'donegal';

@Component({
  selector: 'app-synthesis-snapshot',
  template: `
  <div>Sythesising: {{inputHtml}}</div>
  <ngx-audio-player
    style="width: 100%;"
    [playlist]="msaapPlaylist"
    [displayTitle]="msaapDisplayTitle"
    [autoPlay]="false"
    muted="muted"
    [displayPlaylist]="msaapDisplayPlayList"
    [pageSizeOptions]="pageSizeOptions"
    (trackEnded)="onEnded($event)"
    [displayVolumeControls]="msaapDisplayVolumeControls"
    [displayRepeatControls]="msaapDisplayRepeatControls"
    [disablePositionSlider]="msaapDisablePositionSlider"
    [displayArtist]="msaapDisplayArtist"
    [displayDuration]="msaapDisplayDuration"
    [expanded]="true"></ngx-audio-player>
  `,
  styles: [
    ``,
    ``,
  ],
  // templateUrl: './synthesis-snapshot.component.html',
  // styleUrls: ['./synthesis-snapshot.component.css']
})
export class SynthesisSnapshotComponent implements OnInit, OnChanges {
  creationDate: Date;
  audioBlobUrl: string;
  audio: HTMLAudioElement;

  msaapPlaylist: Track[] = [];
  msaapDisplayTitle = true;
  muted = false;
  msaapDisplayPlayList = false;
  pageSizeOptions = true;
  msaapDisplayVolumeControls = true;
  msaapDisplayRepeatControls = true;
  msaapDisablePositionSlider = true;
  msaapDisplayArtist = false;
  msaapDisplayDuration = true;

  @Input('frozenHtmlText') inputHtml: string;

  ngOnChanges() {
    console.log('CHANGES DETECTED');
    this.resynthesise();
  }

  constructor(
    private synth: SynthesisService,
    private sanitizer: DomSanitizer,
  ) {}

  onEnded(event: any){
    console.log('ENDED', event);
  }

  ngOnInit(): void {
    this.creationDate = new Date();
    console.log('frozenHtmlText in synthesis-snapshot', this.inputHtml);
    this.resynthesise();
  }

  resynthesise(): void {
    console.log('synthesising text:', this.inputHtml);
    const d = (this.inputHtml ? this.inputHtml : 'Fan go fóill.' );
    this.synth.synthesiseHtml({
      input: d,
      voice: this.synth.voice('connemara' as Dialect /* TODO use the story's dialect*/),
      speed: 1,
      audioEncoding: 'MP3' as AbairAPIv2AudioEncoding,
    }).then((blob) => {
      this.audioBlobUrl = URL.createObjectURL(blob);
      console.dir(this.audioBlobUrl);
      this.audio = new Audio(this.audioBlobUrl);
      this.audio.play(); // TODO debug
      this.msaapPlaylist.push({
        title: new Date().toTimeString(),
        link: this.audioBlobUrl,
      });
    });
  }

  sanitize(url: string) {
    return url.replace(/^unsafe:/, '');
  }

}
