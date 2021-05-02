import { Injectable } from '@angular/core';
import { Story } from '../story';
import { HttpClient } from '@angular/common/http';
import config from '../../abairconfig.json';

@Injectable({
  providedIn: 'root'
})
export class SynthesisService {

  constructor(private http: HttpClient) { }

  baseUrl = config.baseurl;

  /**
   * Gets synthesis data for storyObject from
   * the backend, which comes in the form of HTML data.
   * Then parses that HTML data to populate Paragraph
   * and Sentence objects.
   * 
   * @param storyObject - Story to be synthesised
   * @returns - Paragraph and Sentence objects containing data for
   * synthesis of input story.
   */
  async synthesiseStory(storyObject: Story): Promise<[Paragraph[], Sentence[]]> {
    const synthesisResponse = await this.http.post(this.baseUrl + 'story/synthesiseObject/', {story: storyObject}).toPromise() as SynthesisResponse;
    const sentences: Sentence[] = [];
    const paragraphs: Paragraph[] = [];
    synthesisResponse.html.forEach((sentenceHtmlArray, i) => {
      let paragraphSentences: Sentence[] = [];
      for (const sentenceHtml of sentenceHtmlArray) {
        // sentenceSpan contains a span child for each word in the sentence
        const sentenceSpan = this.textToElem(sentenceHtml) as HTMLSpanElement;
        const sentence = new Sentence();
        sentence.startTime = +sentenceSpan.children[0].getAttribute('data-begin');
        const lastSentenceChild = sentenceSpan.children[sentenceSpan.childElementCount-1]
        sentence.duration = (+lastSentenceChild.getAttribute('data-begin') + +lastSentenceChild.getAttribute('data-dur')) - sentence.startTime;
        sentence.audio = new Audio(synthesisResponse.audio[i]);
        sentence.spans = Array.from(sentenceSpan.children) as HTMLSpanElement[];
        sentence.spans.forEach(span => span.classList.add('highlightable'));
        sentences.push(sentence);
        paragraphSentences.push(sentence);
      }
      const paragraph = new Paragraph();
      paragraph.audio = new Audio(synthesisResponse.audio[i]);
      paragraph.spans = paragraphSentences.reduce((acc, sentence) => acc.concat(sentence.spans), []);
      paragraphs.push(paragraph);
    });
    return [paragraphs, sentences];
  }

  /**
   * Converts a string of HTML code into a DOM Node object.
   * 
   * @param htmlString - String representation of a HTML object
   * @returns - A DOM Node representing htmlString
   */
  textToElem(htmlString: string): Node {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild; 
  } 
}

/**
 * Data structure to package / interact with synthesis data.
 * Contains synthesis audio, and synthesised words in
 * <span>s containing meta-data relevant to the synthesis
 * of that word, such as start time and duration.
 * 
 * Also provides functions to play, pause, and highlight
 * text in time with synthesis playback.
 */
export abstract class Section {

  audio: HTMLAudioElement;
  highlightTimeouts: NodeJS.Timer[] = [];
  pauseTimeout: NodeJS.Timer;
  spans: HTMLSpanElement[];
  type: string;

  play(startTime: number, duration: number) {
    this.audio.currentTime = startTime;
    this.audio.play();
    this.pauseTimeout = setTimeout(() => {
      this.stop();
    }, duration * 1000);
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
    clearTimeout(this.pauseTimeout);
  }

  highlight(startTime: number, duration: number) {
    let previousSpan: HTMLSpanElement;
    for (const s of this.spans) {
      // Each span will be highlighted halfway through its playback.
      // Each span is un-highlighted when the next span in the sequence
      //  is highlighted.
      this.highlightTimeouts.push(setTimeout(() => {
        if (previousSpan) previousSpan.classList.add("noHighlight");
        s.classList.add("highlight");
        previousSpan = s;
      }, ((+s.getAttribute("data-begin") * 1000)) + ((+s.getAttribute("data-dur") / 2) * 1000) - (startTime * 1000)));
    }
    this.highlightTimeouts.push(setTimeout(() => {
      this.removeHighlight();
    }, duration * 1000));
  }

  removeHighlight() {
    for (const s of this.spans) {
      s.classList.remove("highlight");
      s.classList.remove("noHighlight");
    }
    this.highlightTimeouts.forEach(t => clearTimeout(t));
  }
}

export class Paragraph extends Section {
  play() {
    super.play(0, this.audio.duration);
  }
  highlight() {
    super.highlight(0, this.audio.duration);
  }
}

export class Sentence extends Section {
  startTime: number;
  duration: number;
  play() {
    super.play(this.startTime, this.duration);
  }
  highlight() {
    super.highlight(this.startTime, this.duration);
  }
}

interface SynthesisResponse {
  audio: string[];
  html: Array<string[]>
}
