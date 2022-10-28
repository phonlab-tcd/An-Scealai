import { GrammarChecker} from '../types';
import { ErrorTag} from '../types';

export const gramadoir: GrammarChecker = {
  name: "AnGramadoir",
  check: check
}; 

async function check(input):Promise<ErrorTag[]>{
  return new Promise<ErrorTag[]>((resolve, reject) => {
    const errors = getDisagreeingVowelIndices(input);
    console.log("ERRORS: ", errors);
    let errorTags:ErrorTag[] = [];
    
    for (const error of errors) {
    
      let tag:ErrorTag = {
        errorText: input,
        messageGA: "string",
        messageEN: "str",
        context: input,
        type: 'LEATHAN-CAOL',
        color: "color",
        fromX: error.first,
        toX: error.second,
      }
      
      errorTags.push(tag);
    }

    resolve(errorTags);
  });
}