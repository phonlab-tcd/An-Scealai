import { Serializable } from "./serializable";

export class StoryMetaData extends Serializable {
    _id: string;
    title: string;
    date: Date;
    lastUpdated: Date;
    studentId: string;
    feedback: {
        seenByStudent: boolean;
        text: string;
        feedbackMarkup: string;
        audioId: string;
    };
}

export class Story extends StoryMetaData {
    // Inherited:
    // _id: string;
    // title: string;
    // date: Date;
    // lastUpdated: Date;
    // studentId: string;
    dialect: string;
    text: string;
    htmlText: string;
    author: string;
    activeRecording: string;
    createdWithPrompts: boolean = false;
}