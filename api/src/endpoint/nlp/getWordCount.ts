const winkNLP = require( 'wink-nlp' );
const model = require('wink-eng-lite-web-model');

const nlp = winkNLP( model );
const STOP_WORDS = ['.', ',', '?', '!', '\n', ';', '-', ':', '\"', '\''];

type WordCountObject = {
    avgWordCount: number;
    totalWords: number;
};

/*
* Get the average word count and total words from an array of texts
*/
export function getWordCount(texts:string[]):Object {
    const wordCounts:any = [];
    let totalWords = 0;
    let wordCountResponse: WordCountObject = {avgWordCount: -1, totalWords: -1};

    if (texts.length > 0) {
        texts.forEach((text) => {
            if (text) {
            const textTokens:any = nlp
                .readDoc(text)
                .tokens()
                .out()
                .filter((token) => !STOP_WORDS.includes(token));
            wordCounts.push(textTokens.length);
            totalWords += textTokens.length;
            }
        });

        let avgWordCount = Math.round(wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length);
        wordCountResponse.avgWordCount = avgWordCount;
        wordCountResponse.totalWords = totalWords;

        return wordCountResponse;
    }
    
    return wordCountResponse;
}