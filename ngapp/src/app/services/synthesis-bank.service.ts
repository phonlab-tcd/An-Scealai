import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SynthesisBankService {

  constructor() { }

  getAudioUrlOfSentence(sentence: string, dialect: string, encoding: string = 'MP3'): string {
    const key = this.generateKey(sentence, dialect, encoding);
    return sessionStorage.getItem(key);
  }

  storeAudioUrlOfSentence(sentence: string, dialect: string, encoding: string = 'MP3', data: string) {
    const key = this.generateKey(sentence, dialect, encoding);
    return sessionStorage.setItem(key, data);
  }

  generateKey(sentence: string, dialect: string, encoding: string) {
    return encodeURIComponent(encoding + dialect + sentence.trim());
  }
}
