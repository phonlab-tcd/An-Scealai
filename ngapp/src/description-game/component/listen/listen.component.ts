import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import config from 'src/abairconfig.json';
import {AuthenticationService} from "src/app/authentication.service";

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

  // @Input('originalAudioData') originalAudioData: any;
  @Input('_id') _id: any;
  @Input('index') index: number;

  audio: HTMLAudioElement;
  audioFromServer: HTMLAudioElement;
  d: Date;
  constructor(
    private http: HttpClient,
    private auth: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.d = date(timestamp(this._id));
    // if(this.audioFileData.originalChunk)
    //   this.audio = new Audio(
    //     window.URL.createObjectURL(
    //       this.audioFileData.originalChunk.data));
    // this.audioFromServer = new Audio(config.baseurl + 'description-game/audio');
    this.http.get(
      config.baseurl + `description-game/audio/${this._id}`,
      {
        headers: {Authorization: 'Bearer ' + this.auth.getToken()},
        responseType: 'text',
      })
      .subscribe(d => {
        console.log('GOT AUDIO FILE');
        console.log(d); 
        const raw = window.atob(d);
        const binaryData = new Uint8Array(new ArrayBuffer(raw.length));
        for(let i = 0; i < raw.length; i++) {
          binaryData[i] = raw.charCodeAt(i);
        }
        const blob = new Blob([binaryData], {'type': 'audio/ogg; codecs=opus'});
        this.audioFromServer = new Audio(URL.createObjectURL(blob));
      },
      e => {
        console.log('ERROR GETTING AUDIO');
        console.log(e);
      },);
  }


}
