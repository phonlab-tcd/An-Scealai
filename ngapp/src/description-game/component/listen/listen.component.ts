import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import config from 'src/abairconfig.json';
import {AuthenticationService} from "src/app/authentication.service";
import { WaveformComponent } from "ng-waveform";

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

  @Input('originalBlob') originalBlob: any;
  @Input('savedAudioRef') savedAudioRef: {
    _id: string;
    mimetype: string;
    uriPrefix: string;
  };
  @Input('index') index: number;
  @ViewChild('waveform') waveform: WaveformComponent;

  onTimeUpdate(e) {
    this.waveform.overlayEl.nativeElement.style.width = e.progress + '%';
  }

  date(){
    if(this.originalBlob) {
      console.log(this.originalBlob);
      console.log(this.originalBlob.timeStart);
      return new Date(this.originalBlob.time.start)
        .toLocaleTimeString();
    }
    if(this.savedAudioRef) {
      console.log(this.savedAudioRef);
      return date(timestamp(this.savedAudioRef._id))
        .toLocaleTimeString();
    }
    else
      return '...';
  };

  audio: HTMLAudioElement;
  d: Date;
  constructor(
    private http: HttpClient,
    private auth: AuthenticationService
  ) { }

  ngOnInit(): void {
    console.log(this.originalBlob);
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
