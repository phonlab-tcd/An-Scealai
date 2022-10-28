export type GrammarChecker = {
  check: (input: string) => Promise<ErrorTag[]>;
  name: string;
};

export type GrammarCache = {[input: string]: ErrorTag[]}

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
                "URU": {color: 'X', messageEN: 'Y', messageGA: 'Z'},
                "SEIMHIU": {color: 'X', messageEN: 'Y', messageGA: 'Z'},
                "LEATHAN-CAOL": {color: 'X', messageEN: 'Y', messageGA: 'Z'},
                "GENITIVE": {color: 'X', messageEN: 'Y', messageGA: 'Z'},
              } as const;
                