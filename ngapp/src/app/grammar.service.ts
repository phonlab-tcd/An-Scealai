import {
  Injectable,
} from '@angular/core';
import {
  HttpClient,
} from '@angular/common/http';
import { Observable, Observer} from 'rxjs';
import { StoryService } from './story.service';
import { TranslationService } from 'app/translation.service';
import { HighlightTag } from 'angular-text-input-highlight';
import { Story } from 'app/story';
import { EngagementService } from 'app/engagement.service';
import { EventType } from 'app/event';
import { VowelAgreementIndex } from './services/quill-highlight.service';
import config from 'abairconfig';

export type DisagreeingVowelIndices = {
  broadFirst: boolean;
  first: number;
  second: number;
};

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

export function getGramadoirRuleSubCategory(str: string) {
  if (GramadoirRuleSubcategorisation[str]) {
    return GramadoirRuleSubcategorisation[str];
  }
  return str;
}

const rare = 'rare';
const wrongNumber = 'wrongNumber';
const article = 'article';
const genitive = 'genitive';
const tense = 'tense';
const vocabulary = 'vocabulary';
export const GramadoirRuleSubcategorisation = {
  // UNCOMMON: rare,
  // NAMMENOWGH: rare,
  // NEAMHCHOIT: rare,
  // CAIGHMOIRF: rare,

  // IOLRA: wrongNumber,
  // UATHA: wrongNumber,
  // AIDIOLRA: wrongNumber,

  // BREISCHEIM: 'BREISCHEIM',

  // NEEDART: article,
  // BADART: article,
  // ONEART: article,

  // GENITIVE: genitive,
  // NOGENITIVE: genitive,

  // PRESENT: tense,
  // CONDITIONAL: tense,
  // NOSUBJ: tense,

  // INPHRASE: vocabulary,
  // BACHOIR: vocabulary,
  // EWNHEANS: vocabulary, // TODO
  // MOLADH: vocabulary,
  // UNKNOWN: vocabulary,
  // DROCHMHOIRF: vocabulary,
  // ANAITHNID: vocabulary,
  // GRAM: vocabulary,

};

export const ReadableGramadoirRuleIds = {
  // SUBCATEGORISATIONS
  // wrongNumber: { ga: '', en: 'Incorrect use of plural/singular'},
  // article: { ga: '', en: 'Incorrect use of a definite or indefinite article (i.e. \'an\', \'na\')'},
  // genitive: { ga: '', en: 'Genitive case' },
  // rare: { ga: '', en: 'Rare words (may be a mistake)' },
  // tense: { ga: '', en: 'Tense' },
  // vocabulary: { ga: '', en: 'Word choice' },

  CAIGHDEAN: { ga: 'Foirme neamhcaighdeánach', en: 'Non-standard word forms' },
  SEIMHIU: { ga: 'Séihmiú', en: 'Lenition/séimhiú (h after first letter)' },
  CLAOCHLU: { ga: '', en: '' },
  NEAMHCHOIT: { ga: '', en: '' },     // = same as next
  NAMMENOWGH: { ga: '', en: '' },     // = same as next
  UNCOMMON: { ga: '', en: '' },       // 'Valid word but extremely
                    // rare in actual usage.
                    // Is this the word you want?'
  DUBAILTE: { ga: '', en: '' },       // 'Repeated word'
  CUPLA: { ga: '', en: '' },          // = same as next
  KESUNYANS: { ga: '', en: '' },      // 'Unusual combination of words'
  IOLRA: { ga: '', en: '' },          // 'The plural form is required here'
  UATHA: { ga: '', en: '' },          // 'The singular form is required here'
  AIDIOLRA: { ga: '', en: '' },       // 'Plural adjective required'
  BREISCHEIM: { ga: 'Breischéim', en: 'Comparative adjective' },     // 'Comparative adjective required'
  NEEDART: { ga: '', en: '' },        // 'Definite article required'
  BADART: { ga: '', en: '' },         // 'Unnecessary use of the definite article'
  ONEART: { ga: '', en: '' },         // 'No need for the first definite article'
  NOGENITIVE: { ga: '', en: '' },     // 'Unnecessary use of the genitive case'
  GENITIVE: { ga: '', en: '' },       // 'The genitive case is required here'
  PRESENT: { ga: '', en: '' },        // 'You should use the present tense here'
  CONDITIONAL: { ga: '', en: '' },    //  'You should use the conditional here'
  NOSUBJ: { ga: '', en: '' },         //  'It seems unlikely that you intended to use the subjunctive here'

  // # TRANSLATORS: You can use whatever kind of quotes you prefer for your locale
  // # around the variable \\1.  You should keep the double backslash before the 1,
  // # but there is no need to escape the quotes the way they are in the msgid.
  INPHRASE: { ga: '', en: '' },       // 'Usually used in the set phrase \/\1\/'
  BACHOIR: { ga: '', en: '' },
  EWNHEANS: { ga: '', en: '' },       //  'You should use \/\1\/ here instead'
  CAIGHMOIRF: { ga: '', en: '' },     // 'Derived from a non-standard form of \/\1\/'
  DROCHMHOIRF: { ga: '', en: '' },    // 'Derived incorrectly from the root \/\1\/'
  ANAITHNID: { ga: '', en: '' },
  ANKOTHVOS: { ga: '', en: '' },
  UNKNOWN: { ga: '', en: '' }, // 'Unknown word'

  // # TRANSLATORS: \\1 is substituted with one or more suggested replacements
  MOLADH: { ga: '', en: '' },         //  'Unknown word: \/\1\/?'
  IONADAI: { ga: '', en: '' },        //  'Valid word but \/\1\/ is more common'
  MOIRF: { ga: '', en: '' },          //  'Not in database but apparently formed from the root \/\1\/'
  NIGA: { ga: '', en: '' },           //  'The word \/\1\/ is not needed'
  MICHEART: { ga: '', en: '' },       // 'Do you mean \/\1\/?'
  MIMHOIRF: { ga: '', en: '' },       // 'Derived form of common misspelling \/\1\/?'
  COMHFHOCAL: { ga: '', en: '' },     // 'Not in database but may be a compound \/\1\/?'
  COMHCHAIGH: { ga: '', en: '' },     // 'Not in database but may be a non-standard compound \/\1\/?'
  GRAM: { ga: '', en: '' },           // 'Possibly a foreign word (the sequence \/\1\/ is highly improbable)'
  GENDER: { ga: '', en: '' },
  GENRE: { ga: '', en: '' },   // 'Gender disagreement'
  NUMBER: { ga: '', en: '' },
  NOMBRE: { ga: '', en: '' },  // 'Number disagreement'
  CASE: { ga: '', en: '' },           // 'Case disagreement'

  // # TRANSLATORS: Rules specific to the Irish language (ga)
  PREFIXH: { ga: '', en: '' },        // 'Prefix \/h\/ missing'
  PREFIXT: { ga: '', en: '' },        // 'Prefix \/t\/ missing'
  PREFIXD: { ga: '', en: '' },        // 'Prefix \/d\'\/ missing'
  NIAITCH: { ga: '', en: '' },        // 'Unnecessary prefix \/h\/'
  NITEE: { ga: '', en: '' },          // 'Unnecessary prefix \/t\/'
  NIDEE: { ga: '', en: '' },          // 'Unnecessary prefix \/d\'\/'
  NIBEE: { ga: '', en: '' },          // 'Unnecessary prefix \/b\'\/'

  // # TRANSLATORS: "Mutation" refers to either "lenition" or "eclipsis" (see below)
  NICLAOCHLU: { ga: '', en: '' },     // 'Unnecessary initial mutation'

  // # TRANSLATORS: "Lenition" is the softening of an initial consonant in Irish.
  // # It is indicated in writing by the addition of an "h": e.g. "bean" -> "bhean"
  NISEIMHIU: { ga: '', en: '' },      // 'Unnecessary lenition'
  NIDARASEIMHIU: { ga: '', en: '' },  // 'The second lenition is unnecessary'
  WEAKSEIMHIU: { ga: '', en: '' },    // 'Often the preposition \/\1\/ causes lenition: { ga: '', en: '' }, but this case is unclear'

  // # TRANSLATORS: "Eclipsis" is: { ga: '', en: '' }, like lenition: { ga: '', en: '' }, a phonetic change applied to
  // # initial consonants in Irish.  It is indicated in writing by the addition
  // # of the eclipsing consonant as a prefix: e.g. "bean" -> "mbean"
  NIURU: { ga: '', en: '' },          // 'Unnecessary eclipsis'
  URU: { ga: '', en: '' },            // 'Eclipsis missing'
  NODATIVE: { ga: '', en: '' },       // 'The dative is used only in special phrases'
  RELATIVE: { ga: '', en: '' },       // 'The dependent form of the verb is required here'
  ABSOLUTE: { ga: '', en: '' },       // 'Unnecessary use of the dependent form of the verb'
  SYNTHETIC: { ga: '', en: '' },
  // 'The synthetic (combined) form, ending in \/\1\/, is often used here'
  default: { ga: 'Error type unkown', en: 'Error type unkown' },
};

const GRAMADOIR_RULE_ID_VALUES: string[] = [
  'CAIGHDEAN',
  'SEIMHIU',
  'CLAOCHLU',
  'CUPLA',				  // Unusual combination of words
  'DROCHMHOIRF',		// Derived incorrectly from the root {arg 1}
  'NEAMHCHOIT',     // = same as next
  'NAMMENOWGH',     // = same as next
  'UNCOMMON',       // 'Valid word but extremely
                    // rare in actual usage.
                    // Is this the word you want?'
  'DUBAILTE',       // 'Repeated word'
  'CUPLA',          // = same as next
  'KESUNYANS',      // 'Unusual combination of words'
  'IOLRA',          // 'The plural form is required here'
  'UATHA',          // 'The singular form is required here'
  'AIDIOLRA',       // 'Plural adjective required'
  'BREISCHEIM',     // 'Comparative adjective required'
  'NEEDART',        // 'Definite article required'
  'BADART',         // 'Unnecessary use of the definite article'
  'ONEART',         // 'No need for the first definite article'
  'NOGENITIVE',     // 'Unnecessary use of the genitive case'
  'GENITIVE',       // 'The genitive case is required here'
  'PRESENT',        // 'You should use the present tense here'
  'CONDITIONAL',    //  'You should use the conditional here'
  'NOSUBJ',         //  'It seems unlikely that you intended to use the subjunctive here'

  // # TRANSLATORS: You can use whatever kind of quotes you prefer for your locale
  // # around the variable \\1.  You should keep the double backslash before the 1,
  // # but there is no need to escape the quotes the way they are in the msgid.
  'INPHRASE',       // 'Usually used in the set phrase \/\1\/'
  'BACHOIR',
  'EWNHEANS',       //  'You should use \/\1\/ here instead'
  'CAIGHDEAN',      // 'Non-standard form of \/\1\/'
  'CAIGHMOIRF',     // 'Derived from a non-standard form of \/\1\/'
  'DROCHMHOIRF',    // 'Derived incorrectly from the root \/\1\/'
  'ANAITHNID',
  'ANKOTHVOS',
  'UNKNOWN', // 'Unknown word'

  // # TRANSLATORS: \\1 is substituted with one or more suggested replacements
  'MOLADH',         //  'Unknown word: \/\1\/?'
  'IONADAI',        //  'Valid word but \/\1\/ is more common'
  'MOIRF',          //  'Not in database but apparently formed from the root \/\1\/'
  'NIGA',           //  'The word \/\1\/ is not needed'
  'MICHEART',       // 'Do you mean \/\1\/?'
  'MIMHOIRF',       // 'Derived form of common misspelling \/\1\/?'
  'COMHFHOCAL',     // 'Not in database but may be a compound \/\1\/?'
  'COMHCHAIGH',     // 'Not in database but may be a non-standard compound \/\1\/?'
  'GRAM',           // 'Possibly a foreign word (the sequence \/\1\/ is highly improbable)'
  'GENDER',
  'GENRE',   // 'Gender disagreement'
  'NUMBER',
  'NOMBRE',  // 'Number disagreement'
  'CASE',           // 'Case disagreement'

  // # TRANSLATORS: Rules specific to the Irish language (ga)
  'PREFIXH',        // 'Prefix \/h\/ missing'
  'PREFIXT',        // 'Prefix \/t\/ missing'
  'PREFIXD',        // 'Prefix \/d\'\/ missing'
  'NIAITCH',        // 'Unnecessary prefix \/h\/'
  'NITEE',          // 'Unnecessary prefix \/t\/'
  'NIDEE',          // 'Unnecessary prefix \/d\'\/'
  'NIBEE',          // 'Unnecessary prefix \/b\'\/'

  // # TRANSLATORS: "Mutation" refers to either "lenition" or "eclipsis" (see below)
  'NICLAOCHLU',     // 'Unnecessary initial mutation'
  'CLAOCHLU',       // 'Initial mutation missing'

  // # TRANSLATORS: "Lenition" is the softening of an initial consonant in Irish.
  // # It is indicated in writing by the addition of an "h": e.g. "bean" -> "bhean"
  'NISEIMHIU',      // 'Unnecessary lenition'
  'NIDARASEIMHIU',  // 'The second lenition is unnecessary'
  'WEAKSEIMHIU',    // 'Often the preposition \/\1\/ causes lenition, but this case is unclear'
  'SEIMHIU',        // 'Lenition missing'

  // # TRANSLATORS: "Eclipsis" is, like lenition, a phonetic change applied to
  // # initial consonants in Irish.  It is indicated in writing by the addition
  // # of the eclipsing consonant as a prefix: e.g. "bean" -> "mbean"
  'NIURU',          // 'Unnecessary eclipsis'
  'URU',            // 'Eclipsis missing'
  'NODATIVE',       // 'The dative is used only in special phrases'
  'RELATIVE',       // 'The dependent form of the verb is required here'
  'ABSOLUTE',       // 'Unnecessary use of the dependent form of the verb'
  'SYNTHETIC',      // 'The synthetic (combined) form, ending in \/\1\/, is often used here'

  'default']; // Add more valid types here


const IGNORE_THESE_GRAMMAR_MESSAGES: string[] = [
  // # TRANSLATORS: Rules specific to the Cornish language (kw)
  'NESSATREYLYANS',     // 'Second (soft) mutation missing'
  'TRESSATREYLYANS',    // 'Third (breathed) mutation missing'
  'PESWARATREYLYANS',   // 'Fourth (hard) mutation missing'
  'PYMPESTREYLYANS',    // 'Fifth (mixed) mutation missing'
  'PYMPESTREYLYANSTH',  // 'Fifth (mixed) mutation after \'th missing'
  // # TRANSLATORS: Rules specific to the Welsh language (cy)
  'LLAES',              // 'Aspirate mutation missing'
  // # TRANSLATORS: Rules specific to the Igbo language (ig)
  'VOWELHARMONY',       // 'This word violates the rules of Igbo vowel harmony'
];
// Makes a union type using the values
// from the array above, see:
// https://www.typescriptlang.org/docs/handbook/2/indexeda
export type GramadoirRuleId = typeof GRAMADOIR_RULE_ID_VALUES[number];

export enum LANGUAGE {
  ENGLISH = 0,
  IRISH = 1,
}

@Injectable({
  providedIn: 'root'
})
export class GrammarService {
  gramadoirUrl = 'https://www.abair.ie/cgi-bin/api-gramadoir-1.0.pl';
  gramadoirCadhanUrl = 'https://cadhan.com/api/gramadoir/1.0';

  broad = ['a', 'o', 'u', 'á', 'ó', 'ú', 'A', 'O', 'U', 'Á', 'Ó', 'Ú'];
  slender = ['e', 'i', 'é', 'í', 'E', 'I', 'É', 'Í'];
  consonants = ['b', 'c', 'd', 'f', 'g', 'h', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'z', 'B', 'C', 'D', 'F', 'G', 'H', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V', 'Z'];
  ignore = ['aniar', 'aníos', 'aréir', 'arís', 'aríst', 'anseo', 'ansin', 'ansiúd', 'cén', 'den', 'faoina', 'ina', 'inar', 'insa', 'lena', 'lenar'];

  userFriendlyGramadoirMessage: {[ruleId: string]: { en: string; ga: string; } } = {
    // CAIGHDEAN: {en: 'non-standard usage', ga: 'TODO'}
    // Add more messages here
  };

  constructor(
    private storyService: StoryService,
    private http: HttpClient,
    private engagement: EngagementService,
    private ts: TranslationService,
  ) { }

  string2GramadoirRuleId = (str: string): GramadoirRuleId => {
    if (!str) { return 'default'; }
    const subString = str.replace(/[A-Za-z:]+\//, '');
    if (!subString) { return 'default'; }
    const ruleIdShortArray = /[A-Z]+/.exec(subString);
    if (!ruleIdShortArray || !ruleIdShortArray[0]) { return 'default'; }
    return getGramadoirRuleSubCategory(ruleIdShortArray[0]);
  }

  // Set grammar and vowel tags of TagSet object
  checkGrammar(id: string): Observable<any> {
    return this.getGramadoirTags(id);
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
    englishP: Promise<GramadoirTag[]>,
    irishP: Promise<GramadoirTag[]>): Promise<HighlightTag[]> {

    let englishTags: GramadoirTag[];
    let irishTags: GramadoirTag[];

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

  gramadoirDirectCadhanObservable(input: string, language: 'en' | 'ga'): Observable<any> {
    return this.http.post(
        this.gramadoirCadhanUrl,
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


  getVowelAgreementUserMessage(unparsedTag: string | null ): string {
    if (!unparsedTag) { return ''; }
    return  this.ts.l.vowels_should_agree ?
            this.ts.l.vowels_should_agree :
            'vowels_should_agree';
  }

  // Takes in a story text and return an
  // array of vowel tags showing slender/broad
  // errors around consonants of words in the text
  getDisagreeingVowelIndices(text: string): DisagreeingVowelIndices[] {
    // Calculate which words need to be skipped, given the 'ignore' array.
    const skipIndices = this.getSkipIndices(text);
    const tags: DisagreeingVowelIndices[] = [];
    // Algorithm to find vowels in the same word on either side of one or more
    // consonants that arent in agreement.
    for(let i = 0; i < text.length - 1; i++) {
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
            const type = this.isLeathan(text[vowelIndex]) // true=BroadFirst false=SlenderFirst
            tags.push({broadFirst: type, first: vowelIndex, second: i});
          }
        }
      }
    }
    return tags;
  }
  
  
  // Takes in a story text and return an
  // array of vowel tags showing slender/broad 
  // errors around consonants of words in the text
  getVowelAgreementTags(text: string): HighlightTag[] {
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
  getSkipIndices(text: string): number[] {
    let skipIndices: number[] = [];
    for (let word of this.ignore) {
      let lowerCaseText = text.toLowerCase();
      let indices = this.getAllIndexes(lowerCaseText, word);
      for (let index of indices) {
        skipIndices[index] = word.length;
      }
    } 
    return skipIndices;
  }

  getAllIndexes(arr: string, val: string | RegExp) : number[] {
    var indexes = [];

    let regex = new RegExp("[\\s.!?\\-]" + val + "[\\s.!?\\-]", "g");
    let match = regex.exec(arr);

    while (match) {
      regex = new RegExp(val);
      let interiorMatch = regex.exec(match[0])
      indexes.push(match.index + interiorMatch.index);
      arr = this.replaceAt(arr, match.index, '#'.repeat(5));
      regex = new RegExp("[\\s.!?\\-]" + val + "[\\s.!?\\-]", "g");
      match = regex.exec(arr);
    }
    
    return indexes;
  }

  // given a string, return the string after
  // changing the content a specified index
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



// **************** Grammar Tag Class ************************
export class GrammarTag {
  type;
  message: string;
  messageEnglish: string;
  messageIrish: string;
  rule: string;

  constructor(
    type: 'vowelAgreement' | 'gramadoir',
    englishTag: any,
    irishTag: any = null)
  {
    this.type = type;
    this.rule = englishTag.ruleId;

    this.message = GrammarTag.getMessageFromRule(this.rule);

    if (type === 'gramadoir') {
      this.messageEnglish = englishTag.msg;
      this.messageIrish = irishTag.msg;
    }
  }

  // Takes in a rule specifing a grammar
  // concept and returns a message explaining the error
  static getMessageFromRule(rule: string): string {
    if (rule === 'VOWEL') {
      return 'vowels_should_agree';
    }
    return null;
  }


  // Specifies the pertaining css
  // class of a given grammar rule
  static getCssClassFromRule(rule: string): string {
    let cssClass: string;
    if (rule === 'Lingua::GA::Gramadoir/SEIMHIU') {
      cssClass = 'seimhiu-color';
    } else if (rule === 'Lingua::GA::Gramadoir/URU') {
      cssClass = 'uru-color';
    } else if (rule === 'VOWEL-CAOL') {
      cssClass = 'vowel-caol-agreement-tag';
    }  else if (rule === 'VOWEL-LEATHAN') {
      cssClass = 'vowel-leathan-agreement-tag';
    } else {
      cssClass = 'default-tag';
    }
    return cssClass + ' tagNotHover';
  }
}
