import { GrammarChecker, ErrorTag, ERROR_INFO, ERROR_TYPES, ErrorType} from '../types';
//import { GrammarChecker as GrammarCheckerGramadoirTS } from '@phonlab-tcd/gramadoir-ts';

// const grammarCheckerGramadoirTS = new GrammarCheckerGramadoirTS('https://gramadoir-breakdown.scealai.abair.ie');

let grammarCheckerGramadoirTS: any;
let grammarCheckerImportedSuccessfully = false;

/**
 * Import the Grammar checker if the user has enough memory to handle it
 * Otherwise, need to call An Gramadoir that is on the abair server
 */
try {
  const memory = (window.performance as Performance & { memory?: any }).memory;
  const memoryThreshold = 2000000000;

  if (memory && memory.usedJSHeapSize < memoryThreshold) {
    import('@phonlab-tcd/gramadoir-ts').then(module => {
      const GrammarCheckerGramadoirTS = module.GrammarChecker;
      grammarCheckerGramadoirTS = new GrammarCheckerGramadoirTS('https://gramadoir-breakdown.scealai.abair.ie');
      console.log("Grammar checker import worked");
      grammarCheckerImportedSuccessfully = true;
      const memory = (window.performance as Performance & { memory?: any }).memory;
    console.log(memory);
    }).catch(error => {
      const memory = (window.performance as Performance & { memory?: any }).memory;
      console.error('Error occurred importing the grammar checker module:', error, memory);
    });
  }
  else {
    console.log("Not enough memeory to import the grammar checker");
    const memory = (window.performance as Performance & { memory?: any }).memory;
    console.log(memory);
    console.log("Grammar checker puts memory ", (memory.usedJSHeapSize - memoryThreshold), " bytes over threshold")
  }
} catch (error) {
  console.error('Error occurred while dynamically importing the grammar checker module:', error);
}


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
async function check(input: string, authToken?: string): Promise<ErrorTag[]>{

  let errors = [];

  // Use the TS Grammar Checker if it was imported successfully
  if (grammarCheckerImportedSuccessfully) {
    console.log("Using TS Grammar checker")
    try {
      console.log("Getting errors from an gramadoir for sentence...")
      errors = await grammarCheckerGramadoirTS.check(input);
    }
    catch (error) {
      console.log("AN GRAMADOIR ERROR: ", error);
    }
  }
  // Otherwise call An Gramadoir that is hosted on the server
  else {
    console.log("Using srv.abair.ie grammar checker")
    try {
      const gramadoirRes = await fetch(`https://gramadoir.abair.ie?text=${encodeURI(input)}`, {});
      const data = await gramadoirRes.json();
      errors = data;
    }
    catch(_) { // Try the cadhan hosted API as a backup, if abair.ie is down.
      console.log("Srv.abair.ie call did not work")
      try {
        errors = await callAnGramadoir(`https://cadhan.com/api/gramadoir/1.0/en/${input}`);
      } catch(_) {
        console.log("Nothing works");
        errors = [];
      }  
    }
  }

  // map gramadoir responses to generic ErrorTag values
  const errorTags: ErrorTag[] = errors.map((error: any) => {
    // get simple rule name from an gramadoir's ruleId response attribute
    const cleanedErrorName = gramadoirId2string(error.ruleId);
    if(!(cleanedErrorName in ERROR_INFO)) {
      console.warn("INVALID ERROR TYPE:", cleanedErrorName);
    }
    const e_info = ERROR_INFO[cleanedErrorName];

    function extractStringBetweenSlashes(inputString: string) {
      const regex = /\/([^/]+)\//; // Regular expression to match the string between slashes
      const match = inputString.match(regex); // Find the first match in the inputString
    
      if (match && match.length > 1) {
        return match[1]; // Return the captured group (string between slashes)
      } else {
        return false; // Return false if no match or captured group found
      }
    }
    
    const suggestion = `"${extractStringBetweenSlashes(error.msg)}"`;
    const errortext = `"${error.errortext}"`;
    
    const et: ErrorTag = {
      errorText: error.errortext,
      messageGA: (e_info.messageGA).replace("#suggestion#", suggestion).replace('#', errortext),
      messageEN: (e_info.messageEN).replace("#suggestion#", suggestion).replace('#', errortext),
      context: error.context,
      nameEN: e_info.nameEN,
      nameGA: e_info.nameGA,
      color: e_info.color,
      fromX: +error.fromx,
      toX: +error.tox + 1,
      type: cleanedErrorName as ErrorType,
      id: crypto.randomUUID(),
    };
    return et;
  });
  return errorTags;
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
function gramadoirId2string(str: string): ErrorType {
  // TODO: on failure return an FAILURE error type and put FAILURE into ERROR_INFO in grammar-engine/types.ts
  // if (!str) { return ''; }
  const subString = str.replace(/[A-Za-z:]+\//, '');
  // if (!subString) { return ''; }
  const ruleIdShortArray = /[A-Z]+/.exec(subString);
  // if (!ruleIdShortArray || !ruleIdShortArray[0]) { return ''; }
  return ruleIdShortArray[0] as ErrorType;
}
