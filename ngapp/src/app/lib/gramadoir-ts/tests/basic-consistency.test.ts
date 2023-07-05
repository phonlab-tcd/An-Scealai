// Readme:
// -------
// This tests for 'basic consistency' between the original gramadoir
// and the step-by-step gramadoir.
// This is achieved by comparing outputs on a set of sentences which cover
// all error types at least once.
// This may not be comprehensive, hence 'basic'.

import TEST_SENTENCES from './test-sentences';
import { grammarCheck, grammarCheckStepByStep } from '../gramadoir';
import { strict as assert } from 'assert';
import { SingleBar } from 'cli-progress';

const progressBar = new SingleBar({
  format: 'Test Progress [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}',
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',
  hideCursor: true
});

function compareArraysOfObjects(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  
  const sortedArr1 = arr1.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
  const sortedArr2 = arr2.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
  
  for (let i = 0; i < sortedArr1.length; i++) {
    const keys1 = Object.keys(sortedArr1[i]);
    const keys2 = Object.keys(sortedArr2[i]);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (let j = 0; j < keys1.length; j++) {
      if (sortedArr1[keys1[j]] !== sortedArr2[keys2[j]]) {
        return false;
      }
    }
  }
  
  return true;
}

(async () => {
  progressBar.start(TEST_SENTENCES.length, 1)
  let index = 1;
  for (const sentence of TEST_SENTENCES) {
    const grammarCheckOutput = await grammarCheck(sentence);
    const grammarCheckStepByStepOutput = await grammarCheckStepByStep(sentence);
    assert(compareArraysOfObjects(grammarCheckOutput, grammarCheckStepByStepOutput));
    progressBar.update(index++);
  }
  console.log(`\nAll ${TEST_SENTENCES.length} tests have passed ✅`);
})();
