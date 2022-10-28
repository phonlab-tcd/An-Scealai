import { GrammarChecker, ErrorTag, ERROR_INFO} from '../types';

// initialise the grammar checker
export const anGramadoir: GrammarChecker = {
  name: "AnGramadoir",
  check: check
}; 

// An Gramadoir response type
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

/**
* Calls An Gramadoir and maps the response to an array of ErrorTags
* @param input - sentence from story text
* @returns - Promise of an array of ErrorTags
*/
async function check(input: string):Promise<ErrorTag[]>{
  return new Promise<ErrorTag[]>(async (resolve, reject) => {
    
    let errorsEN = [];
    let errorsGA = [];
    
    // try calling an gramadoir on lab server, otherwise use an gramadoir from cadhan.com
    try {
      errorsEN = await callAnGramadoir(input, 'en', 'https://www.abair.ie/cgi-bin/api-gramadoir-1.0.pl');
      errorsGA = await callAnGramadoir(input, 'ga', 'https://www.abair.ie/cgi-bin/api-gramadoir-1.0.pl');
    }
    catch(_) {
      try {
        errorsEN = await callAnGramadoir(input, 'en', 'https://cadhan.com/api/gramadoir/1.0');
        errorsGA = await callAnGramadoir(input, 'ga', 'https://cadhan.com/api/gramadoir/1.0');
      } catch(_) {
        reject();
      }  
    }
    
    let errorTags:ErrorTag[] = [];

    // map both English and Irish An Gramadoir values to generic ErrorTag values
    for (let i = 0; i < errorsEN.length; i++) {
      // get simple rule name from an gramadoir's ruleId response attribute
      let cleanedErrorName = await gramadoirId2string(errorsEN[i].ruleId);
      
      let tag:ErrorTag = {
        errorText: errorsEN[i].errortext,
        messageGA: errorsGA[i].msg,
        messageEN: errorsEN[i].msg,
        context: errorsEN[i].context,
        nameEN: ERROR_INFO[cleanedErrorName].nameEN,
        nameGA: ERROR_INFO[cleanedErrorName].nameGA,
        color: ERROR_INFO[cleanedErrorName].color,
        fromX: errorsEN[i].fromx,
        toX: errorsEN[i].tox,
      }
      errorTags.push(tag);
    }
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
* Shorten An Gramadoir ruleId to simple name: ex. Lingua::GA::Gramadoir/MOLADH => MOLADH
* @param str - An Gramadoir ruleId
* @returns - Promise of simplified string
*/
async function gramadoirId2string(str: string): Promise<string> {
  if (!str) { return ''; }
  const subString = str.replace(/[A-Za-z:]+\//, '');
  if (!subString) { return ''; }
  const ruleIdShortArray = /[A-Z]+/.exec(subString);
  if (!ruleIdShortArray || !ruleIdShortArray[0]) { return ''; }
  return ruleIdShortArray[0];
}