import { Serializable } from './serializable';

export class Event extends Serializable {
    _id: string;
    ownerId: string;
    type?: EventType;
    data?: object;
    updatedAt: Date;
}

export class MouseOverGrammarSuggestionEvent extends Event {
  grammarSuggestionData: any;
}

export class PlaySynthesisEvent extends Event {
  voice: Object;
  text: string;
  storyId?: string;
}

export class SaveStoryEvent extends Event {
  storyObject: Object;
}

export enum EventType {
    'CREATE-STORY' = 'CREATE-STORY',
    'DELETE-STORY' = 'DELETE-STORY',
    'SYNTHESISE-STORY' = 'SYNTHESISE-STORY',
    'GRAMMAR-CHECK-STORY' = 'GRAMMAR-CHECK-STORY',
    'REGISTER' = 'REGISTER',
    'LOGIN' = 'LOGIN',
    'LOGOUT' = 'LOGOUT',
    'VIEW-FEEDBACK' = 'VIEW-FEEDBACK',
    'CREATE-MESSAGE' = 'CREATE-MESSAGE',
    'RECORD-STORY' = 'RECORD-STORY',
    'USE-DICTIONARY' = 'USE-DICTIONARY',
    'PROFILE-STATS' = 'PROFILE-STATS',
    'FEATURE-STATS' = 'FEATURE-STATS',
    'USE-PROMPT-GENERATOR' = 'USE-PROMPT-GENERATOR',
    'DELETE-CLASSROOM' = 'DELETE-CLASSROOM',
    'USE-DICTOGLOSS' = 'USE-DICTOGLOSS',
}
