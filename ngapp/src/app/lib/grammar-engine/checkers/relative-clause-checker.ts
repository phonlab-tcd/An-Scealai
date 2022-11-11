import { GrammarChecker, ErrorTag, ERROR_INFO} from '../types';

// initialise checker
export const relativeClauseChecker: GrammarChecker = {
  name: "RelativeClauseChecker",
  check: check
}; 

const relativeClauseUrl = 'https://phoneticsrv3.lcs.tcd.ie/gramsrv/api/grammar';

/**
* Calls the Relative Clause checker and maps the response to an array of ErrorTags
* @param input - sentence from story text
* @returns - Promise of an array of ErrorTags
*/
async function check(input: string):Promise<ErrorTag[]>{
  return new Promise<ErrorTag[]>(async (resolve, reject) => {
    const errors = await callRelativeClauseChecker(input);
    const errorTags: ErrorTag[] = errors.map(error => {
      return {
        errorText: input.slice(error.fromx, error.tox),
        messageGA: ERROR_INFO['RELATIVE-CLAUSE'].messageEN,
        messageEN: ERROR_INFO['RELATIVE-CLAUSE'].messageGA,
        context: error.context,
        nameEN: ERROR_INFO['RELATIVE-CLAUSE'].nameEN,
        nameGA: ERROR_INFO['RELATIVE-CLAUSE'].nameGA,
        color: ERROR_INFO['RELATIVE-CLAUSE'].color,
        fromX: error.fromx,
        toX: error.tox,
      }
    });

    resolve(errorTags);
  });
}

/**
* Fetch the Relative Clause checker response
* @param input - sentence from story text
* @returns - Promise of fetch response or throws error
*/
async function callRelativeClauseChecker(input: string): Promise<any> {
    const res = await fetch(relativeClauseUrl, {
         headers: {
           'Content-Type': 'application/x-www-form-urlencoded',
         },
         method: 'POST',
         body: relativeXWwwFormUrlencodedRequestData(input.replace(/\n/g, ' '))
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
function relativeXWwwFormUrlencodedRequestData(input: string) {
  return `text=${encodeURIComponent(input)}&check=relclause`;
}