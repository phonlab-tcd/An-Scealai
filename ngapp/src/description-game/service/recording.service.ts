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


  async fetchAudioSrc(id: string) {
    const cache = this.fetchFromCache(id);
    if(cache) return cache;
    const src = await this.retrieve(id).toPromise();
    localStorage.setItem('audio.'+id,src);
    return src;
  }

  fetchFromCache(id: string) {
    return localStorage.getItem('audio.'+id);
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
