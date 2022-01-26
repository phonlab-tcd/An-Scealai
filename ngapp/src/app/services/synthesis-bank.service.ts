import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SynthesisBankService {

  constructor() {
  }

  freeSomeSpace(keep: Array<string>) {
    for (const key of Object.keys(sessionStorage)) {
      if(!keep.includes(key)) {
        sessionStorage.removeItem(key);
      }
    }
  }

  getAudioUrlOfSentence(key: string): string {
    return sessionStorage.getItem(key);
  }

  storeAudioUrlOfSentence(key: string, data: string) {
    if (!sessionStorage.getItem(key)) {
      try {
        return sessionStorage.setItem(key, data);
      } catch (e) {
        console.count('FAILED TO SET ITEM IN SESSION STORAGE');
      }
    }
  }
}
