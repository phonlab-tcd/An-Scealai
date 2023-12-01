import { Serializable } from "./serializable";

export class Story extends Serializable {
    _id: string;
    onwer: string;
    title: string;
    dialect: 'connemara' | 'kerry' | 'donegal';
    text: string;
    htmlText: string;
    author: string;
    feedback: {
        seenByStudent: boolean;
        text: string; // DEPRECATED
        feedbackMarkup: string;
        audioId: string; // DEPRECATED
        hasComments: boolean;
    };
    activeRecording: string;
    createdWithPrompts: boolean = false;
    createdAt?: Date;
    updatedAt?: Date;

    constructor() {super()}
}