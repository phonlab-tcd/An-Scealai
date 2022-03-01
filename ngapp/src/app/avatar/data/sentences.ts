interface Sentence {
  id: number;
  text: string;
  errors: object[];
  focussed: boolean;
  readyToSpeak: boolean;
  readyToSpeakHelp: boolean;
  avatarFlashed: boolean;
  awaitingTts: boolean;
  awaitingTtsHelp: boolean;
  awaitingGramadoir: boolean;
  audioData: object;
  audioDataHelp: object;
  editted: boolean;
  orderedTiming: object[];
  helpTiming: object[];
}

const sentences = [
]

export { Sentence, sentences }
