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
                console.log(checker.name);
                console.log(errorTags);
                this.cacheMap.get(checker.name)[s] = errorTags;
                const offsetErrorTags = errorTags.map(tag => {
                    tag.fromX += offset;
                    tag.toX += offset;
                    return tag;
                })
                return offsetErrorTags;
            }))
        ))).flat().filter(err => err.length);

        return allErrorTags;
    }
}