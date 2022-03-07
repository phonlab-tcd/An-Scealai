import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from 'src/app/authentication.service';
import { Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import config from 'src/abairconfig.json';

declare var MediaRecorder: any;

const mimeOptions = [
  'browser default',
  'audio/mp3',// : '.mp3',
  'audio/ogg',// : '.ogg',
  'audio/webm',// : '.ogg',
];

@Component({
  selector: 'description-game-record-message',
  templateUrl: './record-message.component.html',
  styleUrls: ['./record-message.component.css']
})
export class RecordMessageComponent implements OnInit {

  recorder: any = undefined;
  audio: HTMLAudioElement;
  savedAudio: any[] = [];
  mimeOptions = mimeOptions;
  mimeType: typeof mimeOptions[number] = 'browser default';
  oldSaved: any[] = [];
  oldSavedSrcs: any[] = [];
  headers: any;

  constructor(
    private cd: ChangeDetectorRef,
    private http: HttpClient,
    private auth: AuthenticationService,
  ) {}

  selectChange(v) {
    this.mimeType = v;
  }

  ngOnInit(): void {
    if (!navigator.mediaDevices)
      alert('mediaDevices API not supported in this browser')
    if (!navigator.mediaDevices.getUserMedia)
      alert('getUserMedia API not supported in this browser')

    this.http.get<any[]>(
      config.baseurl + 'description-game/allAudio',
      {headers: { Authorization: 'Bearer '.concat(this.auth.getToken())}})
      .subscribe(ok=>{
        this.oldSaved = ok;
        this.oldSaved.forEach(o=>{
          this.retrieve(o).subscribe(src=>{
           o.src = src;
           o.audio = new Audio(src);
           this.cd.detectChanges();
          });
        });
      });
  }

  retrieve(s): Observable<string> {
    return this.http.get(
      config.baseurl + `description-game/audio/${s._id}`,
      {
        headers: { Authorization: 'Bearer '.concat(this.auth.getToken())},
        responseType: 'text',
      })
      .pipe(map(d=>{
        return s.uriPrefix + d;
      }));
  }

  start() {
    navigator.mediaDevices
      .getUserMedia({audio: true})
      .then(_stream => {
        const options =
          this.mimeType === 'browser default' ? 
          undefined :
          { mimeType: this.mimeType };
        this.recorder = new MediaRecorder(_stream, options);
        this.recorder.start();
        this.recorder.ondataavailable = this.save;
      });
  }

  save(chunk) {
    const newlySaved = { originalChunk: chunk, _id: null};
    var form = new FormData();
    form.append('source', chunk.data);
    this.http.post<[{_id: string; mimetype: string; uriPrefix: string}]>(
      config.baseurl + 'description-game/audio',
      form,
      {
        headers: { Authorization: 'Bearer '.concat(this.auth.getToken()) },
      }).subscribe(ok=>{
        this.savedAudio = this.savedAudio.concat(ok);
        this.cd.detectChanges();
      });
  }

  stop() {
    this.recorder.stop();
    this.recorder = undefined;
  }
}
