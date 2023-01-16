import { GrammarChecker, GrammarCache } from './types';
import config from '../../../abairconfig';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthenticationService } from 'app/authentication.service';

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

  console.log(errorDict);
  return errorDict;

  function reducer(dict, cur) {
    if(!dict[cur]) dict[cur] = 0;
    dict[cur] += 1;
    return dict;
  }
}

export class GrammarEngine {
    private cacheMap: Map<string, GrammarCache>;
    private grammarCheckers: GrammarChecker[];
    private http: HttpClient;
    private auth: AuthenticationService;
    private previousErrorTags: Object[];
    private errorsWithSentences = [];
    
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
    public async check(input: string) {
        // Sentence tokenization to make gramadoir requests for each sentence independently
        const sentences = await firstValueFrom(
            this.http.post<string[]>(config.baseurl + 'nlp/sentenceTokenize', {text: input})
        );

        const sentencesWithOffsets = []

        // We need to find the right offset for each sentence, because the gramadoir 'fromx' and 'tox' is relative to the sentence
        // The idea here is to iterate through the tokenized sentences and match them in the original text, to get their offsets
        // Once we have an offset for each sentence, we can apply the 'fromx' 'tox' relative to that.
        let i = 0
        for (let s = 0; s < sentences.length -1; s++) {
            const sIndex = input.slice(i).indexOf(sentences[s]);
            const offset = i + sIndex;
            sentencesWithOffsets.push([offset, sentences[s]]); 
            i = offset + sentences[s].length;
        }

        // keep an array of errors associated with particular sentences
        this.errorsWithSentences = [];
        // check grammar on text using the initialised grammar checkers 
        const allErrorTags = (await Promise.all(this.grammarCheckers.map(async checker =>
            await Promise.all(sentencesWithOffsets.map(async ([offset, s], i) => {
                // get errors from cache map if already stored and return
                if (s in this.cacheMap.get(checker.name)) {
                  let errorTags = this.cacheMap.get(checker.name)[s];
                  this.errorsWithSentences[i] ? this.errorsWithSentences[i] = 
                          [this.errorsWithSentences[i][0].concat(errorTags), s, i] :
                          this.errorsWithSentences[i] = [errorTags, s, i];
                  return errorTags;
                }
                // get errors from grammar checker if not in cache map
                const errorTags = await checker.check(s);
                this.cacheMap.get(checker.name)[s] = errorTags;
                // calculate error offset based on sentence indices
                const offsetErrorTags = errorTags.map(tag => {
                    tag.fromX += offset;
                    tag.toX += offset;
                    return tag;
                })
                
                // add the error tags and sentence pair to array
                this.errorsWithSentences[i] ? this.errorsWithSentences[i] = 
                        [this.errorsWithSentences[i][0].concat(errorTags), s, i] :
                        this.errorsWithSentences[i] = [errorTags, s, i];
                
                return offsetErrorTags;
            }))
        ))).flat().filter(err => err.length);
        
        // log error counts to the DB
        this.countNewErrors(allErrorTags.flat());

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
      const counts = countErrorTypes(toCount);
      const body = {countsByType: counts};
      this.http.post<any>(config.baseurl + 'gramadoir/userGrammarCounts/', body).subscribe();
      
      this.previousErrorTags = newTags;
    }

    
    /**
    * Save an array containing sentences, associated errors, and indexes to the DB
    * @param storyId - id of story being checked for grammar
    */
    async saveErrorsWithSentences(storyId: string) {
      if(!this.errorsWithSentences) {
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
