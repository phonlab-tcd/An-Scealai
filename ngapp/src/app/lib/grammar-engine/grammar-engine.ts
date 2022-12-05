import { GrammarChecker, ErrorTag, GrammarCache } from './types';
import config from '../../../abairconfig';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthenticationService } from 'app/authentication.service';

export class GrammarEngine {
    private cacheMap: Map<string, GrammarCache>;
    private grammarCheckers: GrammarChecker[];
    private http: HttpClient;
    private auth: AuthenticationService;
    private previousErrorTags: Object[] = [];
    
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
    
    public async check(input: string) {
        const sentences = await firstValueFrom(
            this.http.post<string[]>(config.baseurl + 'nlp/sentenceTokenize', {text: input})
        );

        const sentencesWithOffsets = []

        let i = 0
        for (let s = 0; s < sentences.length -1; s++) {
            const sIndex = input.slice(i).indexOf(sentences[s]);
            const offset = i + sIndex;
            sentencesWithOffsets.push([offset, sentences[s]]); 
            i = offset + sentences[s].length;
        }

        const allErrorTags = (await Promise.all(this.grammarCheckers.map(async checker => 
            await Promise.all(sentencesWithOffsets.map(async ([offset, s]) => {
                if (s in this.cacheMap.get(checker.name)) {
                    return this.cacheMap.get(checker.name)[s];
                }
                const errorTags = await checker.check(s);
                this.cacheMap.get(checker.name)[s] = errorTags;
                const offsetErrorTags = errorTags.map(tag => {
                    tag.fromX += offset;
                    tag.toX += offset;
                    return tag;
                })
                return offsetErrorTags;
            }))
        ))).flat().filter(err => err.length);
        
        // log error counts to the DB
        this.countNewErrors(allErrorTags.flat());

        return allErrorTags;
    }
    
    // Count new grammar errors and save to DB
    async countNewErrors(newTags:any[]) {      
      const prevErrorMap = this.previousErrorTags.map(error => JSON.stringify([error['errorText'], error['type']]));
      const newErrorMap = newTags.map(error => JSON.stringify([error.errorText, error.type]));
      
      // Multiset subtraction: currentErrorMap - prevError map
      // This should give us the errors that are new in currentErrorMap
      const toCount = newErrorMap
        .filter(entry => {
          if (prevErrorMap.includes(entry)) {
            prevErrorMap[prevErrorMap.indexOf(entry)] = null;
            return false;
          }
          return true;
        })
        .map(entry => JSON.parse(entry)[1]); // Get error type from string encoding of [errortext, errortype]
      console.log('toCount', toCount);
      
      const headers = { 'Authorization': 'Bearer ' + this.auth.getToken() }
      const body = {errors: toCount,};
      this.http.post<any>(config.baseurl + 'gramadoir/userGrammarCounts/', body, {headers}).subscribe();
      
      this.previousErrorTags = newTags;
    }
}