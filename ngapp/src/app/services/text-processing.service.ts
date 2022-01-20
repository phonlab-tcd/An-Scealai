import { Injectable } from '@angular/core';
// import nlp from 'wink-nlp-utils';

// This ought to be a stateless service.
// The service offers functions but should not
// be used to store state.

@Injectable({
  providedIn: 'root'
})
export class TextProcessingService {

  constructor() {
  }

  convertHtmlTextToArrayOfSentences(html: string): string[] {
    return this.sentences(this.convertHtmlToPlainText(html));
  }

  sentences(text: string): string[] {
    return this.naiveSentences(text);
    // return nlp.string.sentences(text);
  }

  split_and_replace(lines: string[], pattern: string) {
    return lines.flatMap(s=>{
      const ss = s.split(pattern);
      return ss.slice(0,-1)
        .filter(Boolean)
        .map((s:string)=>s+pattern)
        .concat(ss.slice(-1).filter(Boolean));
      });
  }

  naiveSentences(text: string) {
    let ss = text.split('\n').filter(Boolean);
    // split by pattern and append pattern back on if necessary
    for(const pattern of ['.','!','?']) {
      ss = this.split_and_replace(ss,pattern);
    }
    return ss;
  }

  // TODO this is troublesome
  convertHtmlToPlainText(html: string){
    // Create a new div element
    const tempDivElement = document.createElement('div');

    // Set the HTML content with the given value
    tempDivElement.innerHTML = html;

    // Retrieve the text property of the element
    return tempDivElement.textContent || tempDivElement.innerText || '';
  }
}
