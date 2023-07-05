import {get, post} from './http-util'

const BASE_URL = 'http://0.0.0.0:8081'

type GrammarError =   {
  errorlength: string,
  ruleId: string,
  tox: string,
  toy: string,
  msg: string,
  fromy: string,
  errortext: string,
  fromx: string,
  context: string,
  contextoffset: string
}

async function grammarCheck(text: string): Promise<GrammarError[]> {
  return get<GrammarError[]>(`${BASE_URL}/gram/${encodeURIComponent(text)}`);
}

async function grammarCheckStepByStep(text: string): Promise<GrammarError[]> {
  // Step 0. make a 'pristine' version of the text
  const pristine = await post<string, string>(`${BASE_URL}/tidy_input`, text);
  // Step 1. sentence tokenize the text
  const sentences = await post<string, string[]>(`${BASE_URL}/get_sentences_real`, text);
  // Step 2. POS-tag the sentences, e.g. <D>Mo</D> <N pl="n" gnt="n" gnd="m">madra</N>.
  const taggedSentences = await Promise.all(sentences.map(sentence => get<string>(`${BASE_URL}/add_tags_real?text=${encodeURIComponent(sentence)}`)));
  // Step 3. Apply the grammar rules to the POS-tagged sentences, and add new tags indicating errors
  //         e.g. <E msg="SEIMHIU"><D>Mo</D> <N pl="n" gnt="n" gnd="m">madra</N></E>.
  const taggedSentencesAfterRulesApplied = await Promise.all(taggedSentences.map(taggedSentence => get<string>(`${BASE_URL}/rialacha?xml=${encodeURIComponent(taggedSentence)}`)));
  // Step 4. Parse the XML from step 3. to create a JSON output
  const outputs = await Promise.all(
    taggedSentencesAfterRulesApplied.map(
      s => get<GrammarError[]>(`${BASE_URL}/finalise?pristine=${encodeURIComponent(pristine)}&plain=${encodeURIComponent(text)}&xml_after_rules_applied=${encodeURIComponent(s)}`)
    )
  );
  return outputs.flat();
}

(async () => {
  const grammarErrors = await grammarCheckStepByStep('Dia duit. Mo madra.');
  console.log(grammarErrors);
})();