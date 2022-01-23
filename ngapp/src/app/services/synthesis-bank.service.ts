import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SynthesisBankService {

  constructor() {
  }

  freeSomeSpace(keep: Array<{sentence:string;dialect:string;encoding:string}>) {
    for (const key of Object.keys(sessionStorage)) {

    }
  }

  getAudioUrlOfSentence(key: string): string {
    return undefined;
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

  generateKey(sentence: string, dialect: string, encoding: string) {
    return encodeURIComponent(encoding + dialect + sentence.toLowerCase().trim());
  }
}
