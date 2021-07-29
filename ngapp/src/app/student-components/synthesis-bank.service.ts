import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SynthesisBankService {

  constructor() { }

  getAudioUrlOfSentence(sentence: string): string {
    const key = encodeURIComponent(sentence.trim());

    const value = sessionStorage.getItem('SESSION STORAGE ITEM', key);

    console.dir(value);

    return value;
  }
}
