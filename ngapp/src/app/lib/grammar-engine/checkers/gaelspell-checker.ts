import { GrammarChecker, ErrorTag, ERROR_INFO} from '../types';

// initialise the grammar checker
export const gaelSpell: GrammarChecker = {
  name: "GaelSpell",
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
* Calls GaelSpell and maps the response to an array of ErrorTags
* @param input - sentence from story text
* @returns - Promise of an array of ErrorTags
*/
async function check(input: string):Promise<ErrorTag[]>{
  return new Promise<ErrorTag[]>(async (resolve, reject) => {
    
    let errors = [];
    
    errors = await callGaelSpell(input, 'https://cadhan.com/api/gaelspell/1.0');
    console.log(errors);
    
    // map gramadoir responses to generic ErrorTag values: TODO: get actual response and test
    const errorTags: ErrorTag[] = errors.map((error, i) => {
      return {
        errorText: input,
        messageGA: ERROR_INFO['GaelSpell'].messageGA,
        messageEN: ERROR_INFO['GaelSpell'].messageEN,
        context: input,
        nameEN: ERROR_INFO['GaelSpell'].nameEN,
        nameGA: ERROR_INFO['GaelSpell'].nameGA,
        color: ERROR_INFO['GaelSpell'].color,
        fromX: +error.fromx,
        toX: +error.tox + 1,
        type: 'GaelSpell'
      } as ErrorTag;
    });
    resolve(errorTags);
  });
}

/**
* Fetch An Gramadoir response
* @param input - sentence from story text
* @param url - url specifying which instance of an gramadoir to call
* @returns - Promise of returned GramadoirTags
*/
async function callGaelSpell(input: string, url:string): Promise<GramadoirTag[]> {
  const res = await fetch(url, {
       headers: {
         'Content-Type': 'application/x-www-form-urlencoded',
       },
       method: 'POST',
       body: gaelspellXWwwFormUrlencodedRequestData(input.replace(/\n/g, ' '))
     });

  if (res.ok) {
    return await res.json();
  }
  throw new Error(res.statusText);
}

/**
* Encode the story text so it can be sent to GaelSpell in x-www-form-urlencoded form
* @param input - sentence from story text
* @returns - encoded string
*/
function gaelspellXWwwFormUrlencodedRequestData(input: string) {
  return `teacs=${encodeURIComponent(input)}`;
}
