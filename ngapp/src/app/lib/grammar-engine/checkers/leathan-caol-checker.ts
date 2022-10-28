import { GrammarChecker} from '../types';
import { ErrorTag} from '../types';

export const leathanCaolChecker: GrammarChecker = {
  name: "LEATHAN_CAOL",
  check: check
}; 

type DisagreeingVowelIndices = {
  broadFirst: boolean;
  first: number;
  second: number;
};

const broad = ['a', 'o', 'u', 'á', 'ó', 'ú', 'A', 'O', 'U', 'Á', 'Ó', 'Ú'];
const slender = ['e', 'i', 'é', 'í', 'E', 'I', 'É', 'Í'];
const consonants = ['b', 'c', 'd', 'f', 'g', 'h', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'z', 'B', 'C', 'D', 'F', 'G', 'H', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V', 'Z'];
const ignore = ['aniar', 'aníos', 'aréir', 'arís', 'aríst', 'anseo', 'ansin', 'ansiúd', 'cén', 'den', 'faoina', 'ina', 'inar', 'insa', 'lena', 'lenar'];


async function check(input): Promise<ErrorTag[]>{
  return new Promise<ErrorTag[]>((resolve, reject) => {
    const errors = getDisagreeingVowelIndices(input);
    console.log("ERRORS: ", errors);
    let errorTags:ErrorTag[] = [];
    
    for (const error of errors) {
    
      let tag:ErrorTag = {
        errorText: input,
        messageGA: "string",
        messageEN: "str",
<<<<<<< HEAD:ngapp/src/app/lib/grammar-engine/checkers/leathan-caol-checker.ts
        context: input,   // for analysis
=======
        context: input,
>>>>>>> 1ece3da1b118ba1cd003d45d5dc4b3f09973ee3b:ngapp/src/app/lib/scealai-grammar/checkers/leathan-caol-checker.ts
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


// Takes in a story text and returns an
// array of vowel tags showing slender/broad
// errors around consonants of words in the text
function getDisagreeingVowelIndices(text: string): DisagreeingVowelIndices[] {
  // Calculate which words need to be skipped, given the 'ignore' array.
  const skipIndices = getSkipIndices(text);
  const tags: DisagreeingVowelIndices[] = [];
  // Algorithm to find vowels in the same word on either side of one or more
  // consonants that arent in agreement.
  for(let i = 0; i < text.length - 1; i++) {
    if(skipIndices[i] > 0) {
      i += skipIndices[i];
    }
    // if vowel and following letter a consonant
    if(isVowel(text[i]) && isConsonant(text[i+1])) {
      let vowelIndex = i++;
      while(isConsonant(text[i])) {
        i++;
      }
      // stop at an index in the text where there is a vowel
      if(isVowel(text[i])) {
        // push vowel tags onto array if the vowels do not agree
        if(!vowelsAgree(text[vowelIndex], text[i])) {
          const type = isLeathan(text[vowelIndex]) // true=BroadFirst false=SlenderFirst
          tags.push({broadFirst: type, first: vowelIndex, second: i});
        }
      }
    }
  }
  return tags;
}



// Input : text from a story written by a user
// Output : an array 'skipIndices' that contains at a given index i the amount
//          of characters to be skipped in order to get past a word
//          in the 'ignore' array, from where it starts in the input string.
function getSkipIndices(text: string): number[] {
  let skipIndices: number[] = [];
  for (let word of ignore) {
    let lowerCaseText = text.toLowerCase();
    let indices = getAllIndexes(lowerCaseText, word);
    for (let index of indices) {
      skipIndices[index] = word.length;
    }
  } 
  return skipIndices;
}

function getAllIndexes(arr: string, val: string | RegExp) : number[] {
  var indexes = [];

  let regex = new RegExp("[\\s.!?\\-]" + val + "[\\s.!?\\-]", "g");
  let match = regex.exec(arr);

  while (match) {
    regex = new RegExp(val);
    let interiorMatch = regex.exec(match[0]);
    indexes.push(match.index + interiorMatch.index);
    arr = replaceAt(arr, match.index, '#'.repeat(5));
    regex = new RegExp("[\\s.!?\\-]" + val + "[\\s.!?\\-]", "g");
    match = regex.exec(arr);
  }
  
  return indexes;
}

// given a string, return the string after
// changing the content a specified index
function replaceAt(str, index, replacement) : string {
  return str.substr(0, index) + replacement+ str.substr(index + replacement.length);
}

// given a character, returns whether or not it is a vowel
function isVowel(char) : boolean {
  return broad.includes(char) || slender.includes(char);
}

// given a character, returns whether or not it is broad
function isLeathan(char) : boolean {
  return broad.includes(char);
}

// given a character, returns whether or not it is slender
function isCaol(char) : boolean {
  return slender.includes(char);
}

// given a character, returns whether or not it is a consonant
function isConsonant(char) : boolean {
  return consonants.includes(char);
}

// given two vowels, returns whether they are both broad or both slender 
function vowelsAgree(v1, v2) : boolean {
  return (broad.includes(v1) && broad.includes(v2)) || (slender.includes(v1) && slender.includes(v2));
}