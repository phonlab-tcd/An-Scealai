import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

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

  processedChunks() {
    return this.chunks.map(e=>{
      return {
        url: window.URL.createObjectURL(e.data),
        type: e.data.type,
      };
    })
  }

  stop() {
    this.recorder.stop();
  }

  listenBack() {
    this.audio.play();
  }

}
