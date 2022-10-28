import { GrammarChecker} from '../types';
import { ErrorTag} from '../types';

export const anGramadoir: GrammarChecker = {
  name: "AnGramadoir",
  check: check
}; 

export type GramadoirTag = {
  fromy: string;
  fromx: number;
  toy: string;
  tox: number;
  ruleId: string;
  msg: string;
  context: string;
  contextoffset: string;
  errortext: string;
  errorlength: string;
};

async function check(input):Promise<ErrorTag[]>{
  return new Promise<ErrorTag[]>(async (resolve, reject) => {
    
    let errorsEN = [];
    let errorsGA = [];
    
    try {
      errorsEN = await callAnGramadoir(input, 'en', 'https://www.abair.ie/cgi-bin/api-gramadoir-1.0.pl');
      errorsGA = await callAnGramadoir(input, 'ga', 'https://www.abair.ie/cgi-bin/api-gramadoir-1.0.pl');
    }
    catch(_) { // Try the cadhan hosted API as a backup, if abair.ie is down.
      try {
        errorsEN = await callAnGramadoir(input, 'en', 'https://cadhan.com/api/gramadoir/1.0');
        errorsGA = await callAnGramadoir(input, 'ga', 'https://cadhan.com/api/gramadoir/1.0');
      } catch(_) {
        reject();
      }  
    }

    const errorTags = errorsEN.map((errorEN, i) => {
      return {
        errorText: errorEN.errortext,
        messageGA: errorsGA[i].msg,
        messageEN: errorEN.msg,
        context: errorEN.context,
        type: 'URU',
        color: "color",
        fromX: errorEN.fromx,
        toX: errorEN.tox,
      } as ErrorTag;
    });

    resolve(errorTags);
  });
}

async function callAnGramadoir(input: string, language: 'en' | 'ga', url): Promise<GramadoirTag[]> {

  const res = await fetch(url, {
       headers: {
         'Content-Type': 'application/x-www-form-urlencoded',
       },
       method: 'POST',
       body: gramadoirXWwwFormUrlencodedRequestData(input.replace(/\n/g, ' '), language)
     });

  if (res.ok) {
    return await res.json();
  }

  throw new Error(res.statusText);
    
}

function gramadoirXWwwFormUrlencodedRequestData(input: string, language: 'en' | 'ga') {
  return `teacs=${encodeURIComponent(input)}&teanga=${language}`;
}