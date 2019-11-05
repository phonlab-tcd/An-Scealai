import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { of } from 'rxjs';
import { StoryService } from './story.service';
import { HighlightTag } from 'angular-text-input-highlight';
import { catchError, skip } from 'rxjs/operators';
import { Story } from './story';

@Injectable({
  providedIn: 'root'
})
export class GrammarService {

  constructor(private storyService: StoryService, ) { }

  checkGrammar(id: string) : Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      let tagSets : TagSet = new TagSet;
      this.storyService.getStoryBy_id(id).subscribe((story: Story) => {
        this.getGramadoirTags(id).subscribe((res : HighlightTag[]) => {
          let tags : HighlightTag[] = [];
          res.forEach((tag) => {
            tags.push(tag);
          });
          tagSets.gramadoirTags = tags;
          tags = [];
          this.storyService.getStoryBy_id(id).subscribe((story: Story) => {
            let vowelTags = this.getVowelAgreementTags(story.text);
            vowelTags.forEach((tag) => {
              tags.push(tag);
            })
            tagSets.vowelTags = tags;
            console.log(tagSets);
            observer.next(tagSets);
            observer.complete();
          });
        });
      });
    });
  }

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

  broad = ['a', 'o', 'u', 'á', 'ó', 'ú', 'A', 'O', 'U', 'Á', 'Ó', 'Ú'];
  slender = ['e', 'i', 'é', 'í', 'E', 'I', 'É', 'Í'];
  consonants = ['b', 'c', 'd', 'f', 'g', 'h', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'z', 'B', 'C', 'D', 'F', 'G', 'H', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V', 'Z'];
  ignore = ['aniar', 'aníos', 'aréir', 'arís', 'aríst', 'anseo', 'ansin', 'ansiúd', 'cén', 'den', 'faoina', 'ina', 'inar', 'insa', 'lena', 'lenar'];

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
      if(this.isVowel(text[i]) && this.isConsonant(text[i+1])) {
        let vowelIndex = i++;
        while(this.isConsonant(text[i])) {
          i++;
        }
        if(this.isVowel(text[i])) {
          if(!this.vowelsAgree(text[vowelIndex], text[i])) {
            let firstVowelTag : HighlightTag = {
              indices: {
                start: vowelIndex,
                end: vowelIndex+1,
              },
              cssClass: GrammarTag.getCssClassFromRule(this.isCaol(text[vowelIndex]) ? 'VOWEL-CAOL' : 'VOWEL-LEATHAN'),
              data: {
                ruleId: 'VOWEL',
              },
            };
            let secondVowelTag : HighlightTag = {
              indices: {
                start: i,
                end: i+1,
              },
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
      if(text.indexOf(word) > -1) {
        skipIndices[text.indexOf(word)] = word.length;
      }
    }
    return skipIndices;
  }

  isVowel(char) : boolean {
    return this.broad.includes(char) || this.slender.includes(char);
  }

  isLeathan(char) : boolean {
    return this.broad.includes(char);
  }

  isCaol(char) : boolean {
    return this.slender.includes(char);
  }

  isConsonant(char) : boolean {
    return this.consonants.includes(char);
  }

  vowelsAgree(v1, v2) : boolean {
    return (this.broad.includes(v1) && this.broad.includes(v2)) || (this.slender.includes(v1) && this.slender.includes(v2));
  }

}

export class TagSet {
  gramadoirTags : HighlightTag[];
  vowelTags : HighlightTag[];
}

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

  static getMessageFromRule(rule: string) : string {
    if(rule === 'Lingua::GA::Gramadoir/SEIMHIU') {
      return "Séimhiu missing";
    }
    if(rule === 'Lingua::GA::Gramadoir/URU') {
      return "This noun should be plural.";
    }
    // etc.
    if(rule === 'VOWEL') {
      return "These vowels should be in agreement according to the Leathan/Caol rule."
    }
  }

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
