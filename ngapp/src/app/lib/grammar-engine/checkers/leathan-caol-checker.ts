import { GrammarChecker, ErrorTag, ERROR_INFO} from '../types';

// initialise the grammar checker
export const leathanCaolChecker: GrammarChecker = {
  name: "LEATHAN_CAOL",
  check: check
}; 

// indices of vowels that break the rule
type DisagreeingVowelIndices = {
  broadFirst: boolean;
  first: number;
  second: number;
};

const BROAD = ['a', 'o', 'u', 'á', 'ó', 'ú', 'A', 'O', 'U', 'Á', 'Ó', 'Ú'];
const SLENDER = ['e', 'i', 'é', 'í', 'E', 'I', 'É', 'Í'];
const CONSONANTS = ['b', 'c', 'd', 'f', 'g', 'h', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'z', 'B', 'C', 'D', 'F', 'G', 'H', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V', 'Z'];
const IGNORE = ['aniar', 'aníos', 'aréir', 'arís', 'aríst', 'anseo', 'ansin', 'ansiúd', 'cén', 'den', 'faoina', 'ina', 'inar', 'insa', 'lena', 'lenar'];

/**
* Check input text according to broad/slender rule
* @param input - sentence from story text
* @returns - Promise of an array of ErrorTags
*/
async function check(input: string): Promise<ErrorTag[]>{
  return new Promise<ErrorTag[]>((resolve, reject) => {
    const errors = getDisagreeingVowelIndices(input);
    let errorTags:ErrorTag[] = [];
    
    // map index objects to generic ErrorTag values
    for (const error of errors) {
      let tag:ErrorTag = {
        errorText: input,
        messageGA: ERROR_INFO['LEATHAN-CAOL'].messageGA,
        messageEN: ERROR_INFO['LEATHAN-CAOL'].messageEN,
        context: input,
        nameEN: ERROR_INFO['LEATHAN-CAOL'].nameEN,
        nameGA: ERROR_INFO['LEATHAN-CAOL'].nameGA,
        color: ERROR_INFO['LEATHAN-CAOL'].color,
        fromX: error.first,
        toX: error.second,
      }
      errorTags.push(tag);
    }
    resolve(errorTags);
  });
}

/**
* Takes in a story sentence and returns 
* an array of vowel tags showing slender/broad
* errors around consonants of words in the text
* @param text - sentence from story text
* @returns - Array of objects specifying indices of vowel disagreement
*/
function getDisagreeingVowelIndices(text: string): DisagreeingVowelIndices[] {
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

/**
* Calculate which words (irregulars) need to be skipped, given the 'ignore' array.
* @param text - sentence from story text
* @returns - Array 'skipIndices' that contains at a given index i the amount
*                   of characters to be skipped in order to get past a word
*                   in the 'ignore' array, from where it starts in the input string.
*/
function getSkipIndices(text: string): number[] {
  let skipIndices: number[] = [];
  for (let word of IGNORE) {
    let lowerCaseText = text.toLowerCase();
    let indices = getAllIndexes(lowerCaseText, word);
    for (let index of indices) {
      skipIndices[index] = word.length;
    }
  } 
  return skipIndices;
}

/**
* Get all indices 
* @param text - sentence from story text (in lowercase)
* @param val - word from the ignore list
* @returns - Array of indices
*/
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

// given a string, return the string after changing the content a specified index
function replaceAt(str, index, replacement) : string {
  return str.substr(0, index) + replacement+ str.substr(index + replacement.length);
}

// given a character, returns whether or not it is a vowel
function isVowel(char) : boolean {
  return BROAD.includes(char) || SLENDER.includes(char);
}

// given a character, returns whether or not it is broad
function isLeathan(char) : boolean {
  return BROAD.includes(char);
}

// given a character, returns whether or not it is slender
function isCaol(char) : boolean {
  return SLENDER.includes(char);
}

// given a character, returns whether or not it is a consonant
function isConsonant(char) : boolean {
  return CONSONANTS.includes(char);
}

// given two vowels, returns whether they are both broad or both slender 
function vowelsAgree(v1, v2) : boolean {
  return (BROAD.includes(v1) && BROAD.includes(v2)) || (SLENDER.includes(v1) && SLENDER.includes(v2));
}