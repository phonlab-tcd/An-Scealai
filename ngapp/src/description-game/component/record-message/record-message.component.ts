import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from 'src/app/authentication.service';
import { Observable} from 'rxjs';
import { map } from 'rxjs/operators';
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
  savedAudio: any[] = [];
  oldSaved: any[] = [];
  headers: any;

  constructor(
    private cd: ChangeDetectorRef,
    private http: HttpClient,
    private auth: AuthenticationService,
  ) {}

  playAudio(a) {
    a.play()
  }

  ngOnInit(): void {
    console.log(this.http);
    console.log(this.auth);
    if (!navigator.mediaDevices) {
      alert('mediaDevices API not supported in this browser')
    }
    if (!navigator.mediaDevices.getUserMedia) {
      alert('getUserMedia API not supported in this browser')
    }

    this.http.get<any[]>(
      config.baseurl + 'description-game/allAudio',
      {headers: { Authorization: 'Bearer '.concat(this.auth.getToken())}})
      .subscribe(ok=>{
        this.oldSaved = ok;
        this.oldSaved.forEach(this.createAudio);
      });
  }

  private createAudio = o=>{
    this.retrieve(o).subscribe(src=>{
      o.src = src;
      o.audio = new Audio(src);
      this.cd.detectChanges();
    });
  }

  private retrieve(s): Observable<string> {
    return this.http.get(
      config.baseurl + `description-game/audio/${s._id}`,
      {
        headers: { Authorization: 'Bearer '.concat(this.auth.getToken())},
        responseType: 'text',
      })
      .pipe(map(d=>s.uriPrefix.concat(d)));
  }

  start() {
    navigator.mediaDevices
      .getUserMedia({audio: true})
      .then(_stream => {
        this.recorder = new MediaRecorder(_stream);
        this.recorder.start();
        this.recorder.ondataavailable = this.save;
      });
  }

  private save = (chunk) => {
    const newlySaved = { originalChunk: chunk, _id: null};
    var form = new FormData();
    form.append('source', chunk.data);
    console.log(this.http);
    this.http.post<any[]>(
      config.baseurl + 'description-game/audio',
      form,
      {
        headers: { Authorization: 'Bearer '.concat(this.auth.getToken()) },
      }).subscribe(ok=>{
        this.oldSaved = this.oldSaved.concat(ok);
        ok.forEach(this.createAudio);
        // this.savedAudio = this.savedAudio.concat(ok);
        this.cd.detectChanges();
      });
  }

  stop() {
    const r = this.recorder;
    this.recorder = undefined;
    setTimeout(()=>{r.stop()}, 1000);
  }
}
