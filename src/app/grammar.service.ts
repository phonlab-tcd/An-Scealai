import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { of } from 'rxjs';
import { StoryService } from './story.service';
import { HighlightTag } from 'angular-text-input-highlight';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GrammarService {

  constructor(private storyService: StoryService, ) { }

  checkGrammar(id: string) : Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      this.storyService.gramadoir(id).subscribe((res) => {
        let tags : HighlightTag[] = [];
        res.forEach(g => {
          console.log(g);
          let tag : HighlightTag = {
            indices: {
              start: +g.fromx,
              end: +g.tox+1,
            },
            cssClass: GrammarTag.getCssClassFromRule(GrammarTag.getRuleFromRuleId(g.ruleId)),
            data: g
          };
          tags.push(tag);
        });
        observer.next(tags);
        observer.complete();
      });
    });
  }

}

export class GrammarTag {
  message: string;
  rule: string;

  constructor(tagData: any) {
    this.rule = GrammarTag.getRuleFromRuleId(tagData.ruleId);
    this.message = GrammarTag.getMessageFromRule(this.rule);
    if(!this.message) {
      this.message = tagData.msg;
    }
  }

  static getMessageFromRule(rule: string) : string {
    if(rule === 'SEIMHIU') {
      return "Séimhiu missing";
    }
    if(rule === 'URU') {
      return "This noun should be plural.";
    }
    // etc.
  }

  static getCssClassFromRule(rule: string) : string {
    return rule.toLowerCase() + "-color tagNotHover";
  }

  static getRuleFromRuleId(ruleId: string) : string {
    return ruleId.split('/')[1];
  }
}
