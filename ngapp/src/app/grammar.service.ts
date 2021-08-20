import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Observer,  of } from 'rxjs';
import { StoryService } from './story.service';
import { TranslationService } from 'src/app/translation.service';
import { HighlightTag } from 'angular-text-input-highlight';
import { catchError, skip, map } from 'rxjs/operators';
import { Story } from 'src/app/story';
import { EngagementService } from 'src/app/engagement.service';
import { EventType } from 'src/app/event';
import config from 'src/abairconfig.json';

type updateStoryAndCheckGrammarResponse = {
  savedStory: Story | false;
  storyWithIdNotFound?: string;
  saveStoryError?: Error;
  irishGrammarTags: string;
  englishGrammarTags: string;
  irishGramadoirError?: Error;
  englishGramadoirError?: Error;
};

// "[{\"msg\":\"Non-standard form of /duit/\",\"context\":\"Dia dhuit\",\"errortext\":\"dhuit\",\"errorlength\":\"5\",\"ruleId\":\"Lingua::GA::Gramadoir/CAIGHDEAN{duit}\",\"tox\":\"8\",\"toy\":\"0\",\"fromx\":\"4\",\"fromy\":\"0\",\"contextoffset\":\"4\"}]",
type gramadoirTag = {
  fromy: string;
  fromx: string;
  toy: string;
  tox: string;
  ruleId: string;
  msg: string;
  contex: string;
  contextoffset: string;
  errortext: string;
  errorlength: string;
};

export enum LANGUAGE {
  ENGLISH = 0,
  IRISH = 1,
}

@Injectable({
  providedIn: 'root'
})
export class GrammarService {

  gramadoirUrl = 'https://www.abair.ie/cgi-bin/api-gramadoir-1.0.pl';

  broad = ['a', 'o', 'u', 'á', 'ó', 'ú', 'A', 'O', 'U', 'Á', 'Ó', 'Ú'];
  slender = ['e', 'i', 'é', 'í', 'E', 'I', 'É', 'Í'];
  consonants = ['b', 'c', 'd', 'f', 'g', 'h', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'z', 'B', 'C', 'D', 'F', 'G', 'H', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V', 'Z'];
  ignore = ['aniar', 'aníos', 'aréir', 'arís', 'aríst', 'anseo', 'ansin', 'ansiúd', 'cén', 'den', 'faoina', 'ina', 'inar', 'insa', 'lena', 'lenar'];

  constructor(
    private storyService: StoryService,
    private http: HttpClient,
    private ts: TranslationService,
    private engagement: EngagementService,
  ) { }

  /*
  * Set grammar and vowel tags of TagSet object
  */
  checkGrammar(id: string, storyText: string): Observable<any> {
    return Observable.create(
      (observer: Observer<any>) => {
        // get grammar tags for the story object
        this.getGramadoirTags(id)
            .subscribe(
              (res) => {
                observer.next(res);
                observer.complete();
              });
      });
  }

  getGramadoirTagsEnglishAndIrishAsHighlightTags(checkedText: string, story: Story):
    { controller: AbortController; tags: Promise<HighlightTag[]> }{
      this.engagement.addEventForLoggedInUser(EventType['GRAMMAR-CHECK-STORY'], story);
      const controller = new AbortController();
      const englishPromise =
        this.gramadoirDirect(
          checkedText,
          'en',
          controller.signal);

      const irishPromise =
        this.gramadoirDirect(
          checkedText,
          'ga',
          controller.signal);

      return {
        controller,
        tags: this.collateEnglishAndIrishGramadoirResponses(englishPromise, irishPromise),
      };
  }

  async collateEnglishAndIrishGramadoirResponses(
    englishP: Promise<gramadoirTag[]>,
    irishP: Promise<gramadoirTag[]>): Promise<HighlightTag[]> {

    let englishTags: gramadoirTag[];
    let irishTags: gramadoirTag[];

    let letsQuit = false;
    try {
      irishTags = await irishP;
    } catch (err) {
      if (err.name === 'AbortError') {
        letsQuit = true;
      } else {
        throw err;
      }
    }

    try {
      englishTags = await englishP;
    } catch (err) {
      if (err.name === 'AbortError') {
        letsQuit = true;
      } else {
        throw err;
      }
    }

    if (letsQuit) {
      return [];
    }
    const highlightTags: HighlightTag[] = [];

    englishTags.forEach((tag, index) => {
      highlightTags.push({
        indices: {
          // interprent fromx as a number
          start: + tag.fromx,
          // interprent tox as a number
          end: + tag.tox + 1,
        },
        cssClass: GrammarTag.getCssClassFromRule(tag.ruleId),
        data: {
          gramadoir: true,
          english: tag,
          irish: irishTags[index],
        },
      });
    });

    return highlightTags;
  }

  convertJsonGramadoirTagsToHighlightTags(tags: string): HighlightTag[] {
    const highlightTags: HighlightTag[] = [];
    const parsed = JSON.parse(tags);
    console.log(parsed);
    parsed.forEach((tag: any, index: number) => {
      highlightTags.push({
        indices: {
          // interprent fromx as a number
          start: + tag.fromx,
          // interprent tox as a number
          end: + tag.tox + 1,
        },
        cssClass: GrammarTag.getCssClassFromRule(tag.ruleId),
        data: {
          index,
          grammarInfo: tag,
        },
      });
    });
    console.count('HIGHLIGHT TAGS');
    console.log(highlightTags);
    return highlightTags;
  }

  /*
  * Get grammar tag data from an gramadoir
  */
  getGramadoirTags(id: string): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      this.storyService.gramadoirViaBackend(id).subscribe(
        (res) => {
        const tags: HighlightTag[] = [];
        console.dir(res);
        JSON.parse(res.grammarTags).forEach(g => {
          const tag: HighlightTag = {
            indices: {
              start: +g.fromx,
              end: +g.tox + 1,
            },
            cssClass: GrammarTag.getCssClassFromRule(g.ruleId),
            data: g
          };
          tags.push(tag);
        });
        observer.next({
          text: res.text,
          grammarTags: tags});
        observer.complete();
      });
    });
  }

  gramadoirXWwwFormUrlencodedRequestData(input: string, language: 'en' | 'ga') {
    return `teacs=${encodeURIComponent(input)}&teanga=${language}`;
  }

  async gramadoirDirect(text: string, language: 'en' | 'ga', signal: AbortSignal): Promise<gramadoirTag[]> {
    const res = await fetch(this.gramadoirUrl, {
         headers: {
           'Content-Type': 'application/x-www-form-urlencoded',
         },
         method: 'POST',
         signal,
         body: this.gramadoirXWwwFormUrlencodedRequestData(text.replace(/\n/g, ' '), language)
       });

    if (res.ok) {
      return res.json();
    }

    throw new Error(res.statusText);
  }

  gramadoirDirectObservable(input: string, language: 'en' | 'ga'): Observable<any> {
    return this.http.post(
        this.gramadoirUrl,
        this.gramadoirXWwwFormUrlencodedRequestData(input, language),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        });
  }
  async getVowelTagsForTextOnDatabase(id: string): Promise<HighlightTag[]> {
    const story = await this.storyService.getStory(id).toPromise();
    return this.getVowelAgreementTags(story.text);
  }

  /*
  * Takes in a story text and return an array of vowel tags showing slender/broad 
  * errors around consonants of words in the text
  */
  getVowelAgreementTags(text: string) : HighlightTag[] {
    // Calculate which words need to be skipped, given the 'ignore' array.
    let skipIndices = this.getSkipIndices(text);
    let tags : HighlightTag[] = [];
    // Algorithm to find vowels in the same word on either side of one or more
    // consonants that arent in agreement.
    for(let i=0; i<text.length-1; i++) {
      if(skipIndices[i] > 0) {
        i += skipIndices[i];
      }
      // if vowel and following letter a consonant
      if(this.isVowel(text[i]) && this.isConsonant(text[i+1])) {
        let vowelIndex = i++;
        while(this.isConsonant(text[i])) {
          i++;
        }
        // stop at an index in the text where there is a vowel
        if(this.isVowel(text[i])) {
          // push vowel tags onto array if the vowels do not agree
          if(!this.vowelsAgree(text[vowelIndex], text[i])) {
            // set tag for first vowel
            let firstVowelTag : HighlightTag = {
              indices: {
                start: vowelIndex,
                end: vowelIndex+1,
              },
              // set vowel css to either slender/broad
              cssClass: GrammarTag.getCssClassFromRule(this.isCaol(text[vowelIndex]) ? 'VOWEL-CAOL' : 'VOWEL-LEATHAN'),
              data: {
                vowelAgreement: true,
                ruleId: 'VOWEL',
              },
            };
            // set tag for second vowel
            let secondVowelTag : HighlightTag = {
              indices: {
                start: i,
                end: i+1,
              },
              // set vowel css to either slender/broad
              cssClass: GrammarTag.getCssClassFromRule(this.isCaol(text[i]) ? 'VOWEL-CAOL' : 'VOWEL-LEATHAN'),
              data: {
                vowelAgreement: true,
                ruleId: 'VOWEL',
              },
            };
            tags.push(firstVowelTag);
            tags.push(secondVowelTag);
          }
        } 
      }
    }
    return tags;
  }

  // Input : text from a story written by a user
  // Output : an array 'skipIndices' that contains at a given index i the amount
  //          of characters to be skipped in order to get past a word
  //          in the 'ignore' array, from where it starts in the input string.

  getSkipIndices(text : string) : number[] {
    let skipIndices : number[] = [];
    for(let word of this.ignore) {
      let lowerCaseText = text.toLowerCase();
      let indices = this.getAllIndexes(lowerCaseText, word);
      for(let index of indices) {
        skipIndices[index] = word.length;
      }
    } 
    return skipIndices;
  }

/*
* 
*/
  getAllIndexes(arr, val) : number[] {
    var indexes = [];

    let regex = new RegExp("[\\s.!?\\-]" + val + "[\\s.!?\\-]", "g");
    let match = regex.exec(arr);
    
    while(match) {
      regex = new RegExp(val);
      let interiorMatch = regex.exec(match[0])
      indexes.push(match.index + interiorMatch.index);
      arr = this.replaceAt(arr, match.index, '#'.repeat(5));
      regex = new RegExp("[\\s.!?\\-]" + val + "[\\s.!?\\-]", "g");
      match = regex.exec(arr);
      console.log("matched " + val);
      console.log("indexes", indexes);
    }
    
    return indexes;
  }

// given a string, return the string after changing the content a specified index
  replaceAt(str, index, replacement) : string {
    return str.substr(0, index) + replacement+ str.substr(index + replacement.length);
  }

// given a character, returns whether or not it is a vowel
  isVowel(char) : boolean {
    return this.broad.includes(char) || this.slender.includes(char);
  }

// given a character, returns whether or not it is broad
  isLeathan(char) : boolean {
    return this.broad.includes(char);
  }

// given a character, returns whether or not it is slender
  isCaol(char) : boolean {
    return this.slender.includes(char);
  }

// given a character, returns whether or not it is a consonant
  isConsonant(char) : boolean {
    return this.consonants.includes(char);
  }

// given two vowels, returns whether they are both broad or both slender 
  vowelsAgree(v1, v2) : boolean {
    return (this.broad.includes(v1) && this.broad.includes(v2)) || (this.slender.includes(v1) && this.slender.includes(v2));
  }

}


/*
* **************** Grammar Tag Class ************************
*/
export class GrammarTag {
  type;
  message: string;
  messageEnglish: string;
  messageIrish: string;
  rule: string;

  constructor(type: 'vowelAgreement' | 'gramadoir', englishTag: any, irishTag: any = null) {
    this.type = type;
    this.rule = englishTag.ruleId;

    this.message = GrammarTag.getMessageFromRule(this.rule);

    if (type === 'gramadoir') {
      this.messageEnglish = englishTag.msg;
      this.messageIrish = irishTag.msg;
    }
  }

  /*
  * Takes in a rule specifing a grammar concept and returns a message explaining the error
  */
  static getMessageFromRule(rule: string): string {
    /*
    if(rule === 'Lingua::GA::Gramadoir/SEIMHIU') {
      return "Séimhiu missing";
    }
    if(rule === 'Lingua::GA::Gramadoir/URU') {
      return "This noun should be plural.";
    }
    */
    // etc.
    if (rule === 'VOWEL') {
      return 'vowels_should_agree';
    }
    return null;
  }

/*
* Specifies the pertaining css class of a given grammar rule
*/
  static getCssClassFromRule(rule: string) : string {
    let cssClass : string;
    if(rule === 'Lingua::GA::Gramadoir/SEIMHIU') {
      cssClass = "seimhiu-color";
    } else if(rule === 'Lingua::GA::Gramadoir/URU') {
      cssClass = "uru-color";
    } else if(rule === 'VOWEL-CAOL') {
      cssClass = "vowel-caol-agreement-tag";
    }  else if(rule === 'VOWEL-LEATHAN') {
      cssClass = "vowel-leathan-agreement-tag";
    } else {
      cssClass = "default-tag";
    }
    return cssClass + " tagNotHover";
  }
}
