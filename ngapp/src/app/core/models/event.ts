import { Serializable } from './serializable';

export class Event extends Serializable {
    _id: string;
    ownerId: string;
    type?: EventType;
    data?: Object;
    updatedAt: Date;
}

export class MouseOverGrammarSuggestionEvent extends Event {
  grammarSuggestionData: any;
}

export class PlaySynthesisEvent extends Event {
  voice: Object;
  text: string;
  speed: number;
}

export class SaveStoryEvent extends Event {
  storyObject: Object;
}

export enum EventType {
    'REGISTER' = 'REGISTER',
    'LOGIN' = 'LOGIN',
    'LOGOUT' = 'LOGOUT',
    'CREATE-STORY' = 'CREATE-STORY',
    'DELETE-STORY' = 'DELETE-STORY',
    'VIEW-FEEDBACK' = 'VIEW-FEEDBACK',
    'USE-DICTIONARY' = 'USE-DICTIONARY',
    'USE-GRAMMAR-CHECKER' = 'USE-GRAMMAR-CHECKER',
    'RECORD-STORY' = 'RECORD-STORY',
    'CREATE-MESSAGE' = 'CREATE-MESSAGE',
    'USE-PROMPT-GENERATOR' = 'USE-PROMPT-GENERATOR',
    'USE-DICTOGLOSS' = 'USE-DICTOGLOSS',
    'DELETE-CLASSROOM' = 'DELETE-CLASSROOM',
    'PROFILE-STATS' = 'PROFILE-STATS',
    'FEATURE-STATS' = 'FEATURE-STATS',
}
