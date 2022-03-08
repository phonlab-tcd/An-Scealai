import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import config from 'src/abairconfig.json';
import {AuthenticationService} from "src/app/authentication.service";
import { NgWaveformComponent } from '../../ng-waveform/ng-waveform.component'

function timestamp(_id:string):string {
  return new String(_id).substring(0,8);
}

function date(timestamp: string) {
  return new Date(parseInt(timestamp,16) *1000);
}

@Component({
  selector: 'description-game-listen',
  templateUrl: './listen.component.html',
  styleUrls: ['./listen.component.css']
})
export class ListenComponent implements OnInit {
  @Input('src') src: string;
  @Input('originalBlob') originalBlob: any;
  @Input('savedAudioRef') savedAudioRef: {
    _id: string;
    mimetype: string;
    uriPrefix: string;
  };
  @Input('index') index: number;
  @Input('height') height: number = 40;
  @ViewChild('waveform') waveform: NgWaveformComponent;
  
  backgroundColor = '#b1d0b9';

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    public cd: ChangeDetectorRef,
  ) { }

  onTimeUpdate() {
    this.waveform.refreshProgress();
  }

  togglePlayback() {
    if(this.waveform)
      this.waveform.togglePlayback();
  }

  isPlaying() {
    if(this.waveform)
      return this.waveform.isPlaying();
    return false;
  }

  date(){
    if(this.originalBlob) {
      return new Date(this.originalBlob.time.start)
        .toLocaleTimeString();
    }
  };

  audio: HTMLAudioElement;
  d: Date;

  ngOnInit(): void {
    if(this.originalBlob) {
      this.audio =
        new Audio(
          window.URL.createObjectURL(
            this.originalBlob.data));
      return;
    }

    this.http.get(
      config.baseurl + `description-game/audio/${this.savedAudioRef._id}`,
      {
        headers: {Authorization: 'Bearer ' + this.auth.getToken()},
        responseType: 'text',
      })
      .subscribe(d => {
        this.audio = new Audio(this.savedAudioRef.uriPrefix.concat(d));
      });
  }
}
