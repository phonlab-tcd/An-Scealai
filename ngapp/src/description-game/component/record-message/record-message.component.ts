import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from 'src/app/authentication.service';
import config from 'src/abairconfig.json';


declare var MediaRecorder: any;

@Component({
  selector: 'description-game-record-message',
  templateUrl: './record-message.component.html',
  styleUrls: ['./record-message.component.css']
})
export class RecordMessageComponent implements OnInit {

  recorder: any;
  audio: HTMLAudioElement;
  savedAudio: any[] = [];

  constructor(
    private cd: ChangeDetectorRef,
    private http: HttpClient,
    private auth: AuthenticationService,
  ) { }

  ngOnInit(): void {
     if (!navigator.mediaDevices)
       alert('mediaDevices API not supported in this browser')
     if (!navigator.mediaDevices.getUserMedia)
       alert('getUserMedia API not supported in this browser')
  }

  start() {
    navigator.mediaDevices
      .getUserMedia({audio: true})
      .then(_stream => {
        this.recorder = new MediaRecorder(_stream);
        this.recorder.start();
        this.recorder.ondataavailable = e=>{
          this.save(e);
      };
      });
  }

  private save(chunk) {
    const newlySaved = { originalChunk: chunk, _id: null};
    var form = new FormData();
    form.append('source', chunk.data);
    const headers = {
      Authorization: 'Bearer ' + this.auth.getToken(),
    };
    this.http.post<[string]>(
      config.baseurl + 'description-game/audio',
      form,
      {headers}).subscribe(ok=>{
        this.savedAudio.push(ok[0]);
        this.cd.detectChanges();
        console.log(this.savedAudio);
      });
  }

  stop() {
    this.recorder.stop();
  }
}
