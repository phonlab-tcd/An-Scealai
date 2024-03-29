import { GrammarChecker, GrammarCache, ErrorTag, ErrorType, CHECKBOX_TYPE, ERROR_TYPES} from './types';
import config from '../../abairconfig';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, tap } from 'rxjs';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Subject } from 'rxjs';
import normalizeWhitespace from "../../../../api/src/utils/normalize-whitespace";

function diffNewErrors(prev: any[], curr: any[]) {
  const prevErrsJson = asJson(prev);
  const currErrsJson = asJson(curr);

  const newErrors = extractNew(prevErrsJson, currErrsJson);

  return newErrors;

  function asJson(tags) {
	return tags.map(error => JSON.stringify([error.errorText, error.type]));

  }

  function extractNew(prevJson, currJson) {
      return currJson 
        .filter(entry => {
          if (prevJson.includes(entry)) {
            prevJson[prevJson.indexOf(entry)] = null;
            return false;
          }
          return true;
        })
        .map(entry => JSON.parse(entry)[1]); // Get error type from string encoding of [errortext, errortype]
  }
}

function countErrorTypes(errors) {
  const errorDict = errors.reduce(reducer, {});
  return errorDict;

  function reducer(dict, cur) {
    if(!dict[cur]) dict[cur] = 0;
    dict[cur] += 1;
    return dict;
  }
}

interface SentenceWithOffset {
  sentence: string;
  offset: number;
}


/**
* We need to find the right offset for each sentence, because the gramadoir 'fromx' and 'tox' is relative to the sentence
* The idea here is to iterate through the tokenized sentences and match them in the original text, to get their offsets
* Once we have an offset for each sentence, we can apply the 'fromx' 'tox' relative to that.
* @param sentences - tokenised sentences from story text
* @param input - story text
* @return array of objects containing the sentence and associated offset
*/
function getOffsets(sentences:string[], input: string): SentenceWithOffset[] {
  const sentencesWithOffsets:SentenceWithOffset[] = [];
  let i = 0;
  for (let sentence of sentences) {
    if (sentence) {
      const sIndex = input.slice(i).indexOf(sentence);
      const offset = i + sIndex;
      sentencesWithOffsets.push({sentence, offset}); 
      i = offset + sentence.length;
    }
  }
  return sentencesWithOffsets;
}


/**
* Clones error objects from sentences in cache
* @param object - error objects
*/
function clone(object) {
  return Object.assign({}, object);
}

class ErrorsByTypeForCurrentCheck {
  private tagStore: Map<string, ErrorTag[]>;

  constructor() {
    this.tagStore = new Map();
  }

  public storeTag(tag: ErrorTag) {
    const stored = this.tagStore.get(tag.type);
    if(stored) {
      stored.push(tag);
    } else {
      this.tagStore.set(tag.type, [tag]);
    }
  }

  public getType(type: ErrorType): ErrorTag[] {
    const stored = this.tagStore.get(type);
    if(stored) return stored;
    else return [];
  }

  public nonEmptyTypes():  ErrorType[] {
    const nonEmpty: ErrorType[] = [];
    for(const type of ERROR_TYPES) {
      const store = this.tagStore.get(type);
      if(store) {
        nonEmpty.push(type);
      }
    }
    return nonEmpty;
  }

  public typeIsNonEmpty(type: ErrorType): boolean {
    return !!this.tagStore.get(type);
  }
}


export class GrammarEngine {
    private cacheMap: Map<string, GrammarCache>;
    private grammarCheckers: GrammarChecker[];
    private http: HttpClient;
    private auth: AuthenticationService;
    private previousErrorTags: Object[] = [];
    private errorsWithSentences = [];

    public errorStoreForLatestCheck: ErrorsByTypeForCurrentCheck;
    
    constructor(grammarCheckers: GrammarChecker[], http: HttpClient, auth: AuthenticationService) {
        this.http = http;
        this.auth = auth;
        this.grammarCheckers = grammarCheckers;
        // make empty caches for each checker
        this.cacheMap = new Map<string, GrammarCache>();
        for (const checker of grammarCheckers) {
            this.cacheMap.set(checker.name, {});
        }
    }
    
    /**
    * Check grammar on given input story text
    * @param input - story text
    */
    public check$(input: string) {
      const subject = new Subject<ErrorTag>();
      const errorStoreForThisCheck = new ErrorsByTypeForCurrentCheck();
      this.errorStoreForLatestCheck = errorStoreForThisCheck;
      this.check(normalizeWhitespace(input), subject);
      return subject.pipe(
        tap(function(tag: ErrorTag) { errorStoreForThisCheck.storeTag(tag);})
      );
    }
    
    /**
    * Check grammar on given input story text
    * @param input - story text
    * @param subj - Subject to handle the errors as they come in
    */
    public async check(input: string, subj: Subject<ErrorTag>) {
      // Sentence tokenization to make gramadoir requests for each sentence independently
      const sentences = await firstValueFrom(
          this.http.post<string[]>(config.baseurl + 'nlp/sentenceTokenize', {text: input})
      );
      //.log("Tokenised all the sentences");
      
      // calculate offset indices for each sentence in relation to entire text
      const sentencesWithOffsets = getOffsets(sentences, input);

      //console.log("Caclulated all the offsets")

      // keep an array of errors associated with particular sentences
      this.errorsWithSentences = [];
      // check grammar on text using the initialised grammar checkers 
      const allErrorTags = (await Promise.all(this.grammarCheckers.map(async checker => {
          return await Promise.all(sentencesWithOffsets.map(async (o, i) => {
              const s = o.sentence;
              const offset = o.offset;
              
              // function to set error tag indices based on associated offset
              function mapOffset(errorTag: ErrorTag): ErrorTag {
                  errorTag.fromX += offset;
                  errorTag.toX += offset;
                  subj.next(errorTag);
                  return errorTag;
              }
              
              // get errors from cache map if already stored and return
              if (s in this.cacheMap.get(checker.name)) {
                //console.log("Getting sentence from cache")
                let errorTags = this.cacheMap.get(checker.name)[s].map(clone).map(mapOffset);
                
                this.errorsWithSentences[i] ? this.errorsWithSentences[i] = 
                        [this.errorsWithSentences[i][0].concat(errorTags), s, i] :
                        this.errorsWithSentences[i] = [errorTags, s, i];
                return errorTags;
              }
              // get errors from grammar checker if not in cache map
              //console.log("getting sentence from checker")
              const errorTags = await checker.check(s, this.auth.getToken());
              this.cacheMap.get(checker.name)[s] = errorTags;
              //console.log("got errors from checker, setting the cache")
              // calculate error offset based on sentence indices
              const offsetErrorTags = errorTags.map(clone).map(mapOffset)
              
              // add the error tags and sentence pair to array
              // TODO: initailly mapped this to {errors, sentence} (would need to fix insert.js)
              /*
              sentences: (await Promise.all(errorTagsArray))
              .sort(([e1,s1,i1],[e2,s2,i2])=>i1-i2)
              .map(([errors, sentence]) => ({errors, sentence})),
              */
             if (errorTags.length > 0) {
              this.errorsWithSentences[i] ? this.errorsWithSentences[i] = 
                      [this.errorsWithSentences[i][0].concat(errorTags), s, i] :
                      this.errorsWithSentences[i] = [errorTags, s, i];
             }
              
              return offsetErrorTags;
          }))
      }))).flat().filter(err => err.length);
      subj.complete();
      
      // log error counts to the DB
      this.countNewErrors(allErrorTags.flat());
      //this.saveErrorsWithSentences();

      return allErrorTags;
    }

    
    /**
    * Check number of new errors and save to DB
    * @param newTags - array of grammar tags since most recent grammar check
    */
    async countNewErrors(newTags:any[]) {      
      this.previousErrorTags = newTags;
      this.countNewErrors = this._countNewErrorsAfterFirstTime;
    }

    private async _countNewErrorsAfterFirstTime(newTags: any[]) {
      const toCount = diffNewErrors(this.previousErrorTags, newTags);
      if (!toCount) console.log("ISSUE GETTING NEW ERROR COUNTS: ", toCount)
      const counts = countErrorTypes(toCount);
      const body = {countsByType: counts};
      if (body.countsByType != null) this.http.post<any>(config.baseurl + 'gramadoir/userGrammarCounts/', body).subscribe();
      
      this.previousErrorTags = newTags;
    }

    
    /**
    * Save an array containing sentences, associated errors, and indexes to the DB
    * @param storyId - id of story being checked for grammar
    */
    async saveErrorsWithSentences() {
      const storyId: string = localStorage.getItem("currentStoryId")!;
      if(!this.errorsWithSentences || !storyId) {
        return;
      }
      const headers = { 'Authorization': 'Bearer ' + this.auth.getToken() }
      const body = {
        storyId,
        sentences: this.errorsWithSentences,
      };
      this.http.post<any>(config.baseurl + 'gramadoir/insert/', body, {headers}).subscribe();
    }
}
