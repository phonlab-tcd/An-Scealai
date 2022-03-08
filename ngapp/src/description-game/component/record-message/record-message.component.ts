import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
        this.recorder.ondataavailable = (dataavailable) => {
          this.save(dataavailable);
        };
      });
  }

  private save = (dataavailable) => {
    console.log(dataavailable);
    const newlySaved = { originalBlob: dataavailable, d: null};
    this.saved.push(newlySaved);
    this.cd.detectChanges();
    var form = new FormData();
    form.append('source', dataavailable.data);
    console.log(this.http);
    this.http.post<any[]>(
      config.baseurl + 'description-game/audio',
      form,
      {
        headers: { Authorization: 'Bearer '.concat(this.auth.getToken()) },
      }).subscribe(ok=>{
        newlySaved.d = ok[0];
        this.cd.detectChanges();
      });
  }

  stop() {
    const r = this.recorder;
    this.recorder = undefined;
    setTimeout(()=>{r.stop()}, 1000);
  }
}
