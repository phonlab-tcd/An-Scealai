import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService} from 'src/app/authentication.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import config from 'src/abairconfig.json';

export interface AudioMessageData {
  _id: string;
  uriPrefix: string;
  mimetype: string;
  src: string;
  audio: HTMLAudioElement;
};

@Injectable({
  providedIn: 'root'
})
export class RecordingService {

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
  ) { }


  createAudio = (o: AudioMessageData)=>{
    return new Promise((resolve,reject) => {
      this.retrieve(o).subscribe(src=>{
        o.src = src;
        o.audio = new Audio(src);
        resolve();
      },e=>{reject(e)});
    });
  }

  retrieve(s: AudioMessageData): Observable<string> {
    return this.http.get(
      config.baseurl + `description-game/audio/${s._id}`,
      {
        headers: { Authorization: 'Bearer '.concat(this.auth.getToken())},
        responseType: 'text',
      })
      .pipe(map(d=>s.uriPrefix.concat(d)));
  }
}
