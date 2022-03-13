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


  createAudio = (id: string)=>{
    return new Promise((resolve,reject) => {
      this.retrieve(id).subscribe(src=>{
        resolve(new Audio(src));
      },e=>{reject(e)});
    });
  }

  retrieve(id: string): Observable<string> {
    return this.http.get(
      config.baseurl + `description-game/audio/${id}`,
      {
        headers: { Authorization: 'Bearer '.concat(this.auth.getToken())},
        responseType: 'text',
      });
  }
}
