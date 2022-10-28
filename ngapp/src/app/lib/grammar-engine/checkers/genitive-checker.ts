import { GrammarChecker} from '../types';
import { ErrorTag} from '../types';

export const genitiveChecker: GrammarChecker = {
  name: "GenitiveChecker",
  check: check
}; 

const genitiveUrl = 'https://phoneticsrv3.lcs.tcd.ie/gramsrv/api/grammar'

async function check(input):Promise<ErrorTag[]>{
  return new Promise<ErrorTag[]>(async (resolve, reject) => {
    const errors = await callGenitiveChecker(input);
    const errorTags: ErrorTag[] = errors.map(error => {
      return {
        errorText: input.slice(error.fromx, error.tox),
        messageGA: "GA_msg",
        messageEN: "EN_msg",
        context: input,
        type: 'GENITIVE',
        color: "color",
        fromX: 0,
        toX: 1,
      }
    });

    resolve(errorTags);
  });
}

async function callGenitiveChecker(input: string): Promise<any> {
    const res = await fetch(genitiveUrl, {
         headers: {
           'Content-Type': 'application/x-www-form-urlencoded',
         },
         method: 'POST',
         body: genitiveXWwwFormUrlencodedRequestData(input.replace(/\n/g, ' '))
       });

    if (res.ok) {
      return await res.json();
    }
  
    throw new Error(res.statusText);
}

function genitiveXWwwFormUrlencodedRequestData(input: string) {
  return `text=${encodeURIComponent(input)}&check=genitive`;
}