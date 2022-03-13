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
  throttle: boolean = false;
  @Output('ondataavailable') dataAvailableEmitter: EventEmitter<boolean> = new EventEmitter();
  @Output('hitStop') hitStop: EventEmitter<{
    start: number;
    stop: number;
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
    this.throttle = true;
    this.cd.detectChanges();
    setTimeout(()=>{
      this.throttle=false;
      this.cd.detectChanges();},
      500);
    console.log('START RECORDING');
    navigator.mediaDevices
      .getUserMedia({audio: true})
      .then(_stream => {
        this.recorder = new MediaRecorder(_stream);
        this.recorder.start();
        const r = this.recorder;
        r.timeStart = Date.now();
        this.recorder.ondataavailable = (dataavailable) => {
          dataavailable.time = {};
          dataavailable.time.ready = Date.now();
          dataavailable.time.start = r.timeStart;
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
    this.hitStop.emit({start:r.timeStart,stop:r.timeStop});
    setTimeout(()=>{r.stop()}, 500);
  }
}
