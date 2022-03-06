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

  chunks = [];
  recorder: any;
  audio: any;

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
    navigator.mediaDevices.getUserMedia({audio: true}).then(_stream => {
      this.recorder = new MediaRecorder(_stream);
      this.recorder.start();
      this.recorder.ondataavailable = e => {
        console.log(e);
        this.chunks.push(e);
        this.cd.detectChanges();
        this.audio = new Audio(window.URL.createObjectURL(e.data));
      };
    });
  }

  save() {
    var form = new FormData();
    form.append('source', this.chunks[0].data);
    form.append('type', this.chunks[0].data.type);
    const headers = {
        Authorization: 'Bearer ' + this.auth.getToken(),
    };
    this.http.post(
      config.baseurl + 'description-game/audio',
      form,
      {headers})
      .subscribe();
  }

  stop() {
    this.recorder.stop();
  }

  listenBack() {
    this.audio.play();
  }

}
