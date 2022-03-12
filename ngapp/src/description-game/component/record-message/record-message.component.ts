import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from 'src/app/authentication.service';
import { RecordingService} from 'src/description-game/service/recording.service';
import config from 'src/abairconfig.json';

declare var MediaRecorder: any;

@Component({
  selector: 'description-game-record-message',
  templateUrl: './record-message.component.html',
  styleUrls: ['./record-message.component.css']
})
export class RecordMessageComponent implements OnInit {

  recorder: any = undefined;
  audio: HTMLAudioElement;
  saved: any[] = [];
  headers: any;
  @Output('ondataavailable') dataAvailableEmitter: EventEmitter<{
   data: Blob,
   time: {
     start: Date,
     stop: Date,
     ready: Date,
   },
  }> = new EventEmitter();

  constructor(
    private cd: ChangeDetectorRef,
    private http: HttpClient,
    private auth: AuthenticationService,
    private rec: RecordingService,
  ) {}

  ngOnInit(): void {
    if (!navigator.mediaDevices) {
      alert('mediaDevices API not supported in this browser')
    }
    if (!navigator.mediaDevices.getUserMedia) {
      alert('getUserMedia API not supported in this browser')
    }
  }

  start() {
    navigator.mediaDevices
      .getUserMedia({audio: true})
      .then(_stream => {
        this.recorder = new MediaRecorder(_stream);
        this.recorder.start();
        const timeStart = Date.now();
        const r = this.recorder;
        this.recorder.ondataavailable = (dataavailable) => {
          dataavailable.time = {};
          dataavailable.time.start = timeStart;
          dataavailable.time.ready = Date.now();
          dataavailable.time.stop = r.timeStop;
          console.log(r.timeStop);
          this.dataAvailableEmitter.emit(dataavailable);
        };
      });
  }


  stop() {
    const r = this.recorder;
    r.timeStop = Date.now();
    this.recorder = undefined;
    setTimeout(()=>{r.stop()}, 1000);
  }
}
