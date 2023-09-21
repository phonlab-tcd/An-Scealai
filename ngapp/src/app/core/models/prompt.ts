export type PromptData = {
  topic: string;
  level: string;
  dialect: string;
  text: string;
  combinationData: {
    character: string;
    setting: string;
    theme: string;
  };
};

export type PartOfSpeechData = {
  partOfSpeech: string;
  word: string;
  translation: string;
};

export class Prompt {
  constructor(
    public _id: string,
    public type: string,
    public prompt: PromptData,
    public partOfSpeechData: PartOfSpeechData,
    public lastUpdated: Date
  ) {}
}
