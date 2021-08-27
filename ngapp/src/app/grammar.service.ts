import {
  Injectable,
} from '@angular/core';
import {
  HttpClient,
} from '@angular/common/http';
import { Observable, Observer ,  of } from 'rxjs';
import { StoryService } from './story.service';
import { HighlightTag } from 'angular-text-input-highlight';
import { catchError, skip } from 'rxjs/operators';
import { Story } from './story';

export type GramadoirTag = {
  fromy: string;
  fromx: number;
  toy: string;
  tox: number;
  ruleId: string;
  msg: string;
  contex: string;
  contextoffset: string;
  errortext: string;
  errorlength: string;
};

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
  ) { }

  /*
  * Set grammar and vowel tags of TagSet object
  */
  checkGrammar(id: string): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      let tagSets: TagSet = new TagSet;
      // get a story object given an id
      this.storyService.getStory(id).subscribe((story: Story) => {
        // get grammar tags for the story object
        this.getGramadoirTags(id).subscribe((res : HighlightTag[]) => {
          let tags : HighlightTag[] = [];
          // push grammar tags
          res.forEach((tag) => {
            tags.push(tag);
          });
          tagSets.gramadoirTags = tags;
          tags = [];
          //get story object
          this.storyService.getStory(id).subscribe((story: Story) => {
            //set the vowel tags
            let vowelTags = this.getVowelAgreementTags(story.text);
            vowelTags.forEach((tag) => {
              // push vowel tags
              tags.push(tag);
            })
            tagSets.vowelTags = tags;
            console.log("Tagsets", tagSets);
            observer.next(tagSets);
            observer.complete();
          });
        });
      });
    });
  }


  gramadoirXWwwFormUrlencodedRequestData(input: string, language: 'en' | 'ga') {
    return `teacs=${encodeURIComponent(input)}&teanga=${language}`;
  }

  async gramadoirDirect(text: string, language: 'en' | 'ga', signal: AbortSignal): Promise<GramadoirTag[]> {
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

  gramadoirDirectObservable(
    input: string,
    language: 'en' | 'ga'): Observable<any>
  {
    return this.http.post(
        this.gramadoirUrl,
        this.gramadoirXWwwFormUrlencodedRequestData(input, language),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        });
  }

  /*
  * Get grammar tag data from an gramadoir
  */
  getGramadoirTags(id: string) : Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      this.storyService.gramadoir(id).subscribe((res) => {
        let tags : HighlightTag[] = [];
        res.forEach(g => {
          let tag : HighlightTag = {
            indices: {
              start: +g.fromx,
              end: +g.tox+1,
            },
            cssClass: GrammarTag.getCssClassFromRule(g.ruleId),
            data: g
          };
          tags.push(tag);
        });
        observer.next(tags);
        observer.complete();
      });
    });
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
** **************** Tag Set Class **************************

*/
export class TagSet {
  gramadoirTags : HighlightTag[];
  vowelTags : HighlightTag[];
}

/*
* **************** Grammar Tag Class ************************
*/
export class GrammarTag {
  message: string;
  rule: string;

  constructor(tagData: any) {
    this.rule = tagData.ruleId;
    console.log("rule", this.rule);
    
    this.message = GrammarTag.getMessageFromRule(this.rule);
    if(!this.message) {
      this.message = tagData.msg;
    }
  }

/*
* Takes in a rule specifing a grammar concept and returns a message explaining the error
*/
  static getMessageFromRule(rule: string) : string {
    /*
    if(rule === 'Lingua::GA::Gramadoir/SEIMHIU') {
      return "Séimhiu missing";
    }
    if(rule === 'Lingua::GA::Gramadoir/URU') {
      return "This noun should be plural.";
    }
    */
    // etc.
    if(rule === 'VOWEL') {
      return "These vowels should be in agreement according to the Leathan/Caol rule."
    }
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
