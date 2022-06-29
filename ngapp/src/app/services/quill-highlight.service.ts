import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Quill from 'quill';
import { map } from 'rxjs/operators';
import { TranslationService } from 'app/translation.service';
import {
  GramadoirRuleId,
  GrammarService,
  GramadoirTag,
  DisagreeingVowelIndices,
} from 'app/grammar.service';
import {EngagementService} from "../engagement.service";
import { reject, takeRight } from 'lodash';
import {AuthenticationService} from "../authentication.service";
import config from 'abairconfig';
// import clone from 'lodash/clone';
import { of } from 'rxjs';

const Tooltip = Quill.import('ui/tooltip');

export type Messages = {
  en: string;
  ga: string;
};

export type QuillHighlightTag = {
  start: number;
  length: number;
  type: GramadoirRuleId;
  tooltip: any;
  messages: Messages;
};

export enum VOWEL {
  BROAD = 0,
  SLENDER
}

export type VowelAgreementIndex = {
  first: number;
  second: number;
  isFirst: boolean;
  broadFirst: boolean;
};

const Parchment = Quill.import('parchment');

const gramadoirTag =
  new Parchment.Attributor.Attribute(
    'gramadoir-tag',
    'data-gramadoir-tag',
    {scope: Parchment.Scope.INLINE});

Quill.register(gramadoirTag);

const gramadoirTagStyleType =
  new Parchment.Attributor.Attribute(
    'gramadoir-tag-style-type',
    'data-gramadoir-tag-style-type',
    {scope: Parchment.Scope.INLINE});

Quill.register(gramadoirTagStyleType);

const vowelAgreementAttributor =
  new Parchment.Attributor.Attribute(
    'vowel-agreement-tag',
    'data-vowel-agreement-tag',
    {scope: Parchment.Scope.INLINE});

Quill.register(vowelAgreementAttributor);

const genitiveAttributor =
  new Parchment.Attributor.Attribute(
    'genitive-tag',
    'data-genitive-tag',
    {scope: Parchment.Scope.INLINE});

Quill.register(genitiveAttributor);

@Injectable({
  providedIn: 'root'
})
export class QuillHighlightService {
  mostRecentGramadoirInput = null;
  currentGramadoirHighlightTags: QuillHighlightTag[] = [];
  currentFilteredHighlightTags: QuillHighlightTag[] = [];
  currentGenetiveHighlightTags: QuillHighlightTag[] = [];
  outMessages: { ga: string, en: string } = null;

  public showLeathanCaol = true;
  public showGenitive = true;
  public mostRecentHoveredMessages: Messages | null =
      null;

  constructor(
    private grammar: GrammarService,
    private ts: TranslationService,
    private engagement: EngagementService,
    private http: HttpClient,
    private auth: AuthenticationService,
  ) { }

  getMostRecentMessage() {
    if (!this.outMessages) { return ''; }
    if (!this.outMessages[this.ts.l.iso_code]) { return ''; }
    return this.outMessages[this.ts.l.iso_code];
  }

  async updateGrammarErrors(quillEditor: Quill, text: string, storyUnderscoreId: string): Promise<object> {
    // my tslint server keeps
    // asking me to brace these guys
    if (!quillEditor) { return Promise.reject('quillEditor was falsey'); }

    this.clearAllGramadoirTags(quillEditor);

    // (no paragraphs/new lines)
    // const gramadoirInputText = text; // this.story.text.replace(/\n/g, ' ');
    this.mostRecentGramadoirInput = text; // gramadoirInputText;

    let gramadoirPromiseIrish =
      this.grammar.gramadoirDirectObservable(text, 'ga')
      .toPromise();

    const currentGramadoirErrorTypes: object = {};

    // First try get gramadoir errors using ABAIR hosted gramadoir
    let grammarCheckerErrorsPromise =
      this.grammar
          .gramadoirDirectObservable(
            text,
            'en')
          .pipe(
            map(gTags => this.gramadoir2QuillTags(gTags, currentGramadoirErrorTypes))
          ).toPromise();


    let grammarCheckerErrors;
    let grammarCheckerErrorsIrish;

    try {
      grammarCheckerErrors = await grammarCheckerErrorsPromise;
      grammarCheckerErrorsIrish = await gramadoirPromiseIrish;
    } catch (error) {
      console.dir(error);
      gramadoirPromiseIrish =
        this.grammar.gramadoirDirectCadhanObservable(text, 'ga')
        .toPromise();

      // If request to ABAIR gramadoir fails, try Scannell's gramadoir server
      grammarCheckerErrorsPromise =
        this.grammar
            .gramadoirDirectCadhanObservable(
              text,
              'en')
            .pipe(
              map(gTags => this.gramadoir2QuillTags(gTags, currentGramadoirErrorTypes))
            ).toPromise();
      try {
      grammarCheckerErrors = await grammarCheckerErrorsPromise;
      grammarCheckerErrorsIrish = await gramadoirPromiseIrish;
      } catch (secondGramadoirError) {
        console.dir(secondGramadoirError);
        window.alert('Failed to fetch grammar suggestions:\nError 1:\n' +
                     error.message +
                    '\n\nError 2:\n' + secondGramadoirError.message);
      }
    }

    grammarCheckerErrors.forEach((e, i) => {
      e.messages.ga = grammarCheckerErrorsIrish[i].msg;
    });
    this.currentGramadoirHighlightTags = grammarCheckerErrors;

    ((sendGrammarErrorsToDb)=>{
      const headers = { 'Authorization': 'Bearer ' + this.auth.getToken() }
      const body = {
        text,
        storyUnderscoreId,
        tagData: grammarCheckerErrors,
      };
      this.http.post<any>(config.baseurl + 'gramadoir/insert/' ,body,{headers}).subscribe();
    })();

    this.currentGenetiveHighlightTags = await this.grammar
      .genitiveDirectObservable(text)
      .pipe(map(gTags => this.gramadoir2QuillTags(gTags, {})))
      .toPromise();

    for (const tag of this.currentGenetiveHighlightTags) { // TODO(oisin): instead, use the userFriendlyMessage mapping in the 2quillTag function
      tag.messages = {
        en: 'Consider using the genitive.',
        ga: 'Úsáid an tuiseal ginideach.'
      }
    }

    return currentGramadoirErrorTypes;
  }

  private applyVowelAgreementFormatting(
    quillEditor: Quill,
    v: DisagreeingVowelIndices) {

    (v as VowelAgreementIndex).isFirst = true;

    const firstVowelAttributeValue: string =
      JSON.stringify(v);

    quillEditor.formatText(
      v.first,
      1,
      {
        'vowel-agreement-tag': firstVowelAttributeValue,
      },
      'api');

    (v as VowelAgreementIndex).isFirst = false;

    const secondVowelAttributeValue: string =
      JSON.stringify(v);

    quillEditor.formatText(
       v.second,
       1,
       {
         'vowel-agreement-tag': secondVowelAttributeValue,
       },
       'api');

  }

  /**
   * Maps an array of gramadoir tags to quill tags
   * @param tagData - raw gramadoir tags
   * @param currentGramadoirErrorTypes - dictionary counting error types
   * @returns - QuillHighlightTags representing gramadoir tags
   */
  gramadoir2QuillTags(tagData: GramadoirTag[], currentGramadoirErrorTypes: object = {}): QuillHighlightTag[] {
    return tagData.map(tag => {
        const ruleIdShort =
          this.grammar.string2GramadoirRuleId(tag.ruleId);
        currentGramadoirErrorTypes[ruleIdShort] ?
          currentGramadoirErrorTypes[ruleIdShort]++ :
          currentGramadoirErrorTypes[ruleIdShort] = 1;
        const qTag: QuillHighlightTag = {
          start: + tag.fromx,
          length: + tag.tox + 1 - tag.fromx,
          type: ruleIdShort,
          tooltip: null,
          messages: { en: tag.msg, ga: null},
        };
        return qTag;
      }
    )
  }

  filterGramadoirTags(filter: object) {
    this.currentFilteredHighlightTags = [];
    this.currentGramadoirHighlightTags
        .forEach((t) => {
          if (filter[t.type]) {
            this.currentFilteredHighlightTags.push(t);
          }
        });

  }

  applyManyVowelAgreementFormatting(
    quillEditor: Quill,
    vs: DisagreeingVowelIndices[]) {
    if (!vs) { return; }
    for (const v of vs) {
      this.applyVowelAgreementFormatting(quillEditor, v);
    }
  }

  applyGramadoirTagFormatting(quillEditor: Quill) {
    if (!this.currentFilteredHighlightTags) { return; }
    this.currentFilteredHighlightTags
        .forEach((error) => {
          // Add highlighting to error text
          quillEditor
              .formatText(
                  error.start,
                  error.length,
                  {
                    'gramadoir-tag-style-type': error.type,
                    'gramadoir-tag': JSON.stringify(error),
                  },
                  'api'
              );
        });
    
    if (this.showGenitive) {
        for (const tag of this.currentGenetiveHighlightTags) {
            quillEditor.formatText(
                tag.start,
                tag.length,
                {
                'genitive-tag': JSON.stringify(tag),
                },
                'user'
            );
        }
    }

    this.generateGramadoirTagTooltips(quillEditor);
  }

  generateGramadoirTagTooltips(quillEditor: Quill) {

    if (this.showLeathanCaol) {
      const disagreeingVowelIndices =
        this.grammar.getDisagreeingVowelIndices(quillEditor.getText());
      this.applyManyVowelAgreementFormatting(
        quillEditor,
        disagreeingVowelIndices);
    }

    const t1 = 'data-gramadoir-tag';
    const t2 = 'data-genitive-tag';
    const t3 = 'data-vowel-agreement-tag';
    const tagElements = document.querySelectorAll(`[${t1}],[${t2}],[${t3}]`);
    tagElements.forEach(t=>this.createGrammarPopup(quillEditor, t));
  }

  clearAllGramadoirTags(quillEditor: Quill) {
    this.clearGramadoirTagFormatting(quillEditor);
    // remove any remaining custom-tooltips from the DOM.
    //  -> without doing this, a tooltip can live on past its
    //     corresponding highlight tag if the user stays hovering
    //     on the highlight tag while the grammar error is fixed.
    document.querySelectorAll('.custom-tooltip').forEach(elem => elem.remove());
  }

  private clearGramadoirTagFormatting(quillEditor: Quill) {
    quillEditor.formatText(
        0, // from the very beginning of the text
        quillEditor.getLength(), // to the very end of the text
        {'gramadoir-tag': null} // delete all gramadoir-tag's on the parchment
    );
    quillEditor.formatText(
        0, 
        quillEditor.getLength(), 
        {'gramadoir-tag-style-type': null} 
    );
    quillEditor.formatText(
        0,
        quillEditor.getLength(), 
        {'vowel-agreement-tag': null}
    );
    quillEditor.formatText(
        0, 
        quillEditor.getLength(), 
        {'genitive-tag': null}
    );
  }

    private createGrammarPopup(
    quillEditor: Quill,
    tagElement: Element,
    ) {
      const messages = {en: '',ga: ''};
      let errorType: string;
      let start = 0;
      let length = 1;
      type fn = (a:number,b:number)=>number;
      const min:fn=(a,b)=>a<b?a:b;
      const max:fn=(a,b)=>a>b?a:b;
      // data-gramadoir-tag
      (()=>{
        const t1 = tagElement.getAttribute('data-gramadoir-tag');
        if(t1) {
          const parsed = JSON.parse(t1);
          messages.en += '<hr>' + parsed.messages.en;
          messages.ga += '<hr>' + parsed.messages.ga;
          errorType = parsed.type;
          start = parsed.start ?? start;
          length = parsed.length ?? length;
        }
      })();

      (()=>{
        const t2 = tagElement.getAttribute('data-genitive-tag');
        if(t2) {
          const parsed = JSON.parse(t2);
          messages.en += '<hr>' + parsed.messages.en;
          messages.ga += '<hr>' + parsed.messages.ga;
          start = parsed.start ?? start;
          length = parsed.length ?? length;
        }
      })();

      (()=>{
        const t3 = tagElement.getAttribute('data-vowel-agreement-tag');
        if(t3) {
          const parsed = JSON.parse(t3);
          console.log(parsed);
          messages.en += '<hr>' + (this.ts.getLanguageFromCode('en')as any).vowels_should_agree;
          messages.ga += '<hr>' + (this.ts.getLanguageFromCode('ga') as any).vowels_should_agree;
          start = parsed.first;
          length = parsed.second - parsed.first;
        }
      })();
      messages.en = messages.en.replace(/^<hr>/,'');
      messages.ga = messages.ga.replace(/^<hr>/,'');


    const error: any = {start,length,messages,type: errorType};
    // Create a customised quill tooltip containing
    // a message about the grammar error
    error.tooltip = new Tooltip(quillEditor);
    error.tooltip.root.classList.add('custom-tooltip');

    // Add hover UI logic to the grammar error span element
    tagElement.addEventListener('mouseover', () => {
      this.mouseOverTagElem(quillEditor, error, tagElement);
    });

    tagElement.addEventListener('mouseout', () => {
      tagElement.removeAttribute('data-selected');
      error.tooltip.hide();
    });
  }

  private mouseOverTagElem(
    quillEditor: Quill,
    error: QuillHighlightTag,
    tagElement: Element,
  )
  {
    tagElement.setAttribute('data-selected','');
    this.outMessages = error.messages;
    this.mostRecentHoveredMessages = error.messages;

    // for some reason bounds aren't calculated correctly until someone scrolls
    const scrollTop = quillEditor.root.scrollTop;
    quillEditor.root.scroll({top: + scrollTop + 1});
    quillEditor.root.scroll({top: + scrollTop});

    error.tooltip.root.innerHTML = error.messages[this.ts.l.iso_code];

    error.tooltip.show();
    error.tooltip.position(quillEditor.getBounds(error.start, error.length));

    let style = error.tooltip.root.getAttribute('style') || '';
    style = style + 'font-size: medium; z-index: 10000001;';
    error.tooltip.root.setAttribute('style', style);

    // Ensure that tooltip isn't cut off by the right edge of the editor
    const rightOverflow =
      (error.tooltip.root.offsetLeft + error.tooltip.root.offsetWidth) -
      quillEditor.root.offsetWidth;

    error.tooltip.root.style.left =
      (rightOverflow > 0) ?
      `${(error.tooltip.root.offsetLeft - rightOverflow) - 5}px` : // - 5px for right padding
      error.tooltip.root.style.left;

    // Ensure that tooltip isn't cut off by the left edge of the editor
    error.tooltip.root.style.left =
      (error.tooltip.root.offsetLeft < 0) ?
      `${(error.tooltip.root.offsetLeft - error.tooltip.root.offsetLeft) + 5}px` : // + 5px for left padding
      error.tooltip.root.style.left;

    this.engagement.mouseOverGrammarSuggestionEvent(error);
  }
}
