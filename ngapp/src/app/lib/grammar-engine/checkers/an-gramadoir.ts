import { GrammarChecker, ErrorTag, ERROR_INFO} from '../types';

// initialise the grammar checker
export const anGramadoir: GrammarChecker = {
  name: "AnGramadoir",
  check: check
}; 

// An Gramadoir response type
export type GramadoirTag = {
  fromy: number;
  fromx: number;
  toy: number;
  tox: number;
  ruleId: string;
  msg: string;
  context: string;
  contextoffset: string;
  errortext: string;
  errorlength: string;
};

/**
* Calls An Gramadoir and maps the response to an array of ErrorTags
* @param input - sentence from story text
* @returns - Promise of an array of ErrorTags
*/
async function check(input: string):Promise<ErrorTag[]>{
  return new Promise<ErrorTag[]>(async (resolve, reject) => {
    
    let errors = [];
    
    // try calling an gramadoir on lab server, otherwise use an gramadoir from cadhan.com
    try {
      errors = await callAnGramadoir(input, 'en', 'https://www.abair.ie/cgi-bin/api-gramadoir-1.0.pl');
    }
    catch(_) { // Try the cadhan hosted API as a backup, if abair.ie is down.
      try {
        errors = await callAnGramadoir(input, 'en', 'https://cadhan.com/api/gramadoir/1.0');
      } catch(_) {
        reject();
      }  
    }

    // map gramadoir responses to generic ErrorTag values
    const errorTags: ErrorTag[] = errors.map((error) => {
      // get simple rule name from an gramadoir's ruleId response attribute
      let cleanedErrorName = gramadoirId2string(error.ruleId);
      
      return {
        errorText: error.errortext,
        messageGA: (ERROR_INFO[cleanedErrorName].messageGA).replace('#', error.errortext),
        messageEN: (ERROR_INFO[cleanedErrorName].messageEN).replace('#', error.errortext),
        context: error.context,
        nameEN: ERROR_INFO[cleanedErrorName].nameEN,
        nameGA: ERROR_INFO[cleanedErrorName].nameGA,
        color: ERROR_INFO[cleanedErrorName].color,
        fromX: +error.fromx,
        toX: +error.tox + 1,
        type: cleanedErrorName
      } as ErrorTag;
    });
    resolve(errorTags);
  });
}

/**
* Fetch An Gramadoir response
* @param input - sentence from story text
* @param language - get grammar errors in English or Gaeilge
* @param url - url specifying which instance of an gramadoir to call
* @returns - Promise of returned GramadoirTags
*/
async function callAnGramadoir(input: string, language: 'en' | 'ga', url:string): Promise<GramadoirTag[]> {
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

/**
* Encode the story text so it can be sent to the gramadoir in x-www-form-urlencoded form
* @param input - sentence from story text
* @param language - get grammar errors in English or Gaeilge
* @returns - encoded string
*/
function gramadoirXWwwFormUrlencodedRequestData(input: string, language: 'en' | 'ga') {
  return `teacs=${encodeURIComponent(input)}&teanga=${language}`;
}

/**
* Shorten An Gramadoir response ruleId to simple name: ex. Lingua::GA::Gramadoir/MOLADH => MOLADH
* @param str - An Gramadoir ruleId
* @returns - simplified string
*/
function gramadoirId2string(str: string): string {
  if (!str) { return ''; }
  const subString = str.replace(/[A-Za-z:]+\//, '');
  if (!subString) { return ''; }
  const ruleIdShortArray = /[A-Z]+/.exec(subString);
  if (!ruleIdShortArray || !ruleIdShortArray[0]) { return ''; }
  return ruleIdShortArray[0];
}