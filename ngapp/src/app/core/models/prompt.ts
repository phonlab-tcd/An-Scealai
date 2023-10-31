// all possible values for prompt data
export interface PromptDataRow {
  _id?: string | null;
  isSelected: boolean;
  isEdit: boolean;
  prompt?: string;
  word?: string;
  translation?: string;
  level?: string;
  dialect?: string;
  storyTitle?: string;
  type?: string;
  partOfSpeech?: string;
  lastUpdated?: Date;
}

// all possible table columns for prompt data, includes data type and specifications (order is important)
export const PromptDataColumns = [
  {
    key: "isSelected",
    type: "isSelected",
    label: "",
  },
  {
    key: "prompt",
    type: "text",
    label: "Prompt Text",
    required: true,
  },
  {
    key: "word",
    type: "text",
    label: "Word",
    required: false,
  },
  {
    key: "translation",
    type: "text",
    label: "Translation",
    required: true,
  },
  {
    key: "level",
    type: "text",
    label: "Level",
    required: false,
  },
  {
    key: "dialect",
    type: "text",
    label: "Dialect",
    required: false,
  },
  {
    key: "storyTitle",
    type: "text",
    label: "Story Title",
    required: false,
  },
  {
    key: "type",
    type: "text",
    label: "Type",
    required: false,
  },
  {
    key: "partOfSpeech",
    type: "text",
    label: "Part of Speech",
    required: false,
  },
  {
    key: "lastUpdated",
    type: "date",
    label: "Last Updated",
    required: true,
  },
  {
    key: "isEdit",
    type: "isEdit",
    label: "",
  },
];

/*************************************  DEPRECATED - TODO: Update prompts component */
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