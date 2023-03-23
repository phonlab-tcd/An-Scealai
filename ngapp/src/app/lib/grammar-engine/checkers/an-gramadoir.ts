import { GrammarChecker, ErrorTag, ERROR_INFO} from '../types';
import config from 'abairconfig';

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
async function check(input: string, authToken: string):Promise<ErrorTag[]>{
  return new Promise<ErrorTag[]>(async (resolve, reject) => {
    
    let errors = [];

    // try calling an gramadoir on lab server, otherwise use an gramadoir from cadhan.com
    try {
      errors = await callAnGramadoir(`${config.baseurl}gramadoir/callAnGramadoir/${input}`, authToken);
    }
    catch(_) { // Try the cadhan hosted API as a backup, if abair.ie is down.
      try {
        errors = await callAnGramadoir(`https://cadhan.com/api/gramadoir/1.0/en/${input}`);
      } catch(_) {
        reject();
      }  
    }

    // map gramadoir responses to generic ErrorTag values
    const errorTags: ErrorTag[] = errors.map((error) => {
      // get simple rule name from an gramadoir's ruleId response attribute
      const cleanedErrorName = gramadoirId2string(error.ruleId);
      const e_info = ERROR_INFO[cleanedErrorName];
      
      return {
        errorText: error.errortext,
        messageGA: (e_info.messageGA).replace('#', error.errortext),
        messageEN: (e_info.messageEN).replace('#', error.errortext),
        context: error.context,
        nameEN: e_info.nameEN,
        nameGA: e_info.nameGA,
        color: e_info.color,
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
async function callAnGramadoir(url: string, authToken?: string): Promise<GramadoirTag[]> {
  let headers = {};
  if (authToken) {
    headers = {'Authorization': 'Bearer ' + authToken}
  }

  const res = await fetch(url, {
       headers: headers,
       method: 'POST',
     });

  if (res.ok) {
    return await res.json();
  }
  throw new Error(res.statusText);
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
