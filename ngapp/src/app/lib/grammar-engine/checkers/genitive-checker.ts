import { GrammarChecker, ErrorTag, ERROR_INFO} from '../types';

// initialise checker
export const genitiveChecker: GrammarChecker = {
  name: "GenitiveChecker",
  check: check
}; 

const genitiveUrl = 'https://phoneticsrv3.lcs.tcd.ie/gramsrv/api/grammar'

/**
* Calls the Genitive checker and maps the response to an array of ErrorTags
* @param input - sentence from story text
* @returns - Promise of an array of ErrorTags
*/
async function check(input: string):Promise<ErrorTag[]>{
  return new Promise<ErrorTag[]>(async (resolve, reject) => {
    const errors = await callGenitiveChecker(input);
    let errorTags:ErrorTag[] = [];
  
    // map Genitive checker values to generic ErrorTag values
    for (const error of errors) {
      let tag:ErrorTag = {
        errorText: error.errortext,
        messageGA: ERROR_INFO['GENITIVE'].messageEN,
        messageEN: ERROR_INFO['GENITIVE'].messageGA,
        context: error.context,
        nameEN: ERROR_INFO['GENITIVE'].nameEN,
        nameGA: ERROR_INFO['GENITIVE'].nameGA,
        color: ERROR_INFO['GENITIVE'].color,
        fromX: error.fromx,
        toX: error.tox,
      }
      errorTags.push(tag);
    }
    resolve(errorTags);
  });
}

/**
* Fetch the Genitive checker response
* @param input - sentence from story text
* @returns - Promise of fetch response or throws error
*/
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

/**
* Encode the story text so it can be sent to the checker in x-www-form-urlencoded form
* @param input - sentence from story text
* @returns - encoded string
*/
function genitiveXWwwFormUrlencodedRequestData(input: string) {
  return `text=${encodeURIComponent(input)}&check=genitive`;
}