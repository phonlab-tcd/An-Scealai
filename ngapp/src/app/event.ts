import {
    QuillHighlightTag,
  } from './services/quill-highlight.service';
import {
    Serializable,
  } from 'src/app/serializable';

export class Event extends Serializable {
    '_id': string;
    type: EventType;
    data: object;
    userId: string;
    storyData: object;
    date: Date;
}

export class MouseOverGrammarSuggestionEvent extends Event {
  grammarSuggestionData: any;
}

export enum EventType {
    'CREATE-STORY' = 'CREATE-STORY',
    'DELETE-STORY' = 'DELETE-STORY',
    'SAVE-STORY' = 'SAVE-STORY',
    'SYNTHESISE-STORY' = 'SYNTHESISE-STORY',
    'GRAMMAR-CHECK-STORY' = 'GRAMMAR-CHECK-STORY',
    'MOUSE-OVER-GRAMMAR-SUGGESTION' = 'MOUSE-OVER-GRAMMAR-SUGGESTION',
    'REGISTER' = 'REGISTER',
    'LOGIN' = 'LOGIN',
    'LOGOUT' = 'LOGOUT',
    'VIEW-FEEDBACK' = 'VIEW-FEEDBACK',
    'CREATE-MESSAGE' = 'CREATE-MESSAGE',
    'RECORD-STORY' = 'RECORD-STORY',
    'USE-DICTIONARY' = 'USE-DICTIONARY'
}
