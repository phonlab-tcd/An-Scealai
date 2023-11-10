import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SynthesisBankService {

  constructor() {
  }

  /**
   * Creates a unique string that serves as key/id for storing audio in cache
   * @param textInput synthesised text
   * @param voice selected voice
   * @param speed selected speed
   * @returns string combination of the three parameters
   */
  createCacheKey(textInput: string, voice: string, speed: number) {
    return textInput + voice + speed;
  }

  /**
   * Store the given key and audio data into cache
   * @param key Url of api call to synthesis
   * @param data audio response from api call
   * @returns item saved in cache (or error)
   */
  storeAudioUrlOfSentence(key: string, data: string) {
    if (!sessionStorage.getItem(key)) {
      try {
        return sessionStorage.setItem(key, data);
      } catch (e) {
        console.count('FAILED TO SET ITEM IN SESSION STORAGE');
      }
    }
  }

  /**
   * Get the audio data for the given key
   * @param key id of synth api response (from synthItem)
   * @returns audio data if stored under key
   */
  getAudioForSentence(key: string): string | null {
    return sessionStorage.getItem(key);
  }

  /**
   * Remove the audio data for the given key
   * @param key Url of api call to synthesis
   * @returns audio data removed from cache
   */
  remove(key: string) {
    return sessionStorage.removeItem(key);
  }

  /**
   * Clean out the cache by removing unwanted keys
   * @param keep list of keys to keep in cache
   */
  freeSomeSpace(keep: Array<string>) {
    for (const key of Object.keys(sessionStorage)) {
      if(!keep.includes(key)) {
        sessionStorage.removeItem(key);
      }
    }
  }

}
