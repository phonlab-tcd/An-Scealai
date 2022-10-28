export type GrammarChecker = {
  check: async (input: string) => ErrorTags[];
  name: string;
};

export type ErrorTag = {
  errorText: string;  // for counting
  messageGA: string;
  messageEN: string;
  context: string;   // for analysis
  type: ErrorType;
  color: string;
  fromX: number;
  toX: number;
}

type ErrorType = keyof typeof errors;

const errors = {
                "URU": {color:, messageEng:, messageGA:},
                "SEIMHIU": {color:, messageEng:, messageGA:},
                "CEOL": {color:, messageEng:, messageGA:},
              } as const;
                