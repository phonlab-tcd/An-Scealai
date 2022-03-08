import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from 'src/app/authentication.service';
import { Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import config from 'src/abairconfig.json';

declare var MediaRecorder: any;

const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
  try {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  } catch (e) {
    console.log(e);
    console.log(b64Data); 
  }
}

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

  playAudio(a) {
    console.log(a.src);
    console.dir(a);
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
        this.oldSaved.forEach(o=>{
          this.retrieve(o).subscribe(src=>{
            o.src = src;
            o.audio = new Audio(src.dataUri);
            o.audioBlob = new Audio(src.blobUrl);
            this.cd.detectChanges();
            console.log(this.http);
            console.log(this.auth);
          });
        });
      });
  }

  retrieve(s): Observable<{dataUri:string;blobUrl:string}> {
    return this.http.get(
      config.baseurl + `description-game/audio/${s._id}`,
      {
        headers: { Authorization: 'Bearer '.concat(this.auth.getToken())},
        responseType: 'text',
      })
      .pipe(map(d=>{
        return {
          dataUri: s.uriPrefix + d,
          blobUrl: URL.createObjectURL(b64toBlob(d)),
        }
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
        this.recorder.ondataavailable = (e) => { this.save(e) };
      });
  }

  save(chunk) {
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
        this.savedAudio = this.savedAudio.concat(ok);
        this.cd.detectChanges();
      });
  }

  stop() {
    const r = this.recorder;
    this.recorder = undefined;
    setTimeout(()=>{r.stop()}, 1000);
  }
}
