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

  async removeMessageFromGame(gameId, apiRef){ 
    return this.http.delete(
      config.baseurl + `description-game/describe/audio/${gameId}/${apiRef}`,
      {
        headers: {Authorization: 'Bearer ' + this.auth.getToken()},
      }).subscribe(console.log, console.error);
  }

  async saveToDbAndGetRef(gameId, dataavailable): Promise<string> {
    return new Promise((resolve, reject) => {
      const newlySaved = { originalBlob: dataavailable, apiRef: null};

      var form = new FormData();
      form.append('source', dataavailable.data);
      form.append('game_type','describe');
      form.append('game_id', gameId);
      form.append('time_start', dataavailable.time.start);
      form.append('time_stop',  dataavailable.time.stop );
      form.append('time_ready', dataavailable.time.ready);

      return this.http.post<any[]>(
        config.baseurl + 'description-game/audio',
        form,
        {
          headers: { Authorization: 'Bearer '.concat(this.auth.getToken()) },
        }).subscribe(ok=>{resolve(ok[0])}, reject);
    });
  }

  fetchMetaData(apiRef) {
    return this.http.get<MetaData>(
      config.baseurl + `description-game/meta/audio/${apiRef}`,
      {
        headers: {Authorization: 'Bearer ' + this.auth.getToken()},
      });
  }

  async fetchAudioSrc(id: string): Promise<string> {
    const cache = this.fetchFromCache(id);
    if(cache) return cache;
    const src = await this.retrieve(id).toPromise();
    localStorage.setItem('audio.'+id,src);
    return src;
  }

  fetchFromCache(id: string): string {
    return localStorage.getItem('audio.'+id);
  }

  private retrieve(id: string): Observable<string> {
    return this.http.get(
      config.baseurl + `description-game/audio/${id}`,
      {
        headers: { Authorization: 'Bearer '.concat(this.auth.getToken())},
        responseType: 'text',
      });
  }
}

interface MetaData {
  time: {
    start: number;
    stop: number;
    ready: number;
  };
  mimetype: string;
}
