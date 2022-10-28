export type GrammarChecker = {
  check: (input: string) => Promise<ErrorTag[]>;
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
                "LEATHAN-CAOL": {color:, messageEng:, messageGA:}
              } as const;
                