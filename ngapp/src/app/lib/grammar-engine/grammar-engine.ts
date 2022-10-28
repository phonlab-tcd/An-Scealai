import { GrammarChecker, ErrorTag, GrammarCache } from './types';
import config from '../../../abairconfig';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export class GrammarEngine {
    private cacheMap: Map<string, GrammarCache>;
    private grammarCheckers: GrammarChecker[];
    private http: HttpClient;
    
    constructor(grammarCheckers: GrammarChecker[], http: HttpClient) {
        this.http = http;
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
        const allErrorTags = [];
        for (const checker of this.grammarCheckers) {
            for (const s of sentences) {
                if (s in this.cacheMap[checker.name]) {
                    allErrorTags.push(this.cacheMap[checker.name][s]);
                } else {
                    const errorTags = await checker.check(s);
                    this.cacheMap[checker.name][s] = errorTags;
                    allErrorTags.push(errorTags);
                }
            }
        }

        const aet = this.grammarCheckers.map(checker => 
            sentences.map(async s => {
                if (s in this.cacheMap[checker.name]) {
                    return this.cacheMap[checker.name][s];
                }
                const errorTags = await checker.check(s);
                this.cacheMap[checker.name][s] = errorTags;
                return errorTags;
            })
        );

        return allErrorTags;
    }
}