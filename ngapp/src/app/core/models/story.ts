import { Serializable } from "./serializable";

export class Story extends Serializable {
    _id: string;
    title: string;
    date: Date;
    lastUpdated: Date;
    dialect: string;
    text: string;
    htmlText: string;
    author: string;
    studentId: string;
    feedback: {
        seenByStudent: boolean;
        text: string;
        feedbackMarkup: string;
        audioId: string;
    };
    activeRecording: string;
    createdWithPrompts: boolean = false;
}