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

  getAudioUrlOfSentence(sentence: string, dialect: string, encoding: string = 'MP3'): string {
    const key = this.generateKey(sentence, dialect, encoding);
    return sessionStorage.getItem(key);
  }

  storeAudioUrlOfSentence(sentence: string, dialect: string, encoding: string = 'MP3', data: string) {
    const key = this.generateKey(sentence, dialect, encoding);
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
