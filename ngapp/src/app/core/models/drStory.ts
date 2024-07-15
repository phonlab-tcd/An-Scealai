import { Serializable } from "./serializable";

export class DigitalReaderStory extends Serializable {
    _id: string;
    owner: string;
    title: string;
    dialect: Array<string>;
    //text: string;
    content: Object;
    //author: string;
    /*feedback: {
        seenByStudent: boolean;
        text: string; // DEPRECATED
        feedbackMarkup: string;
        audioId: string; // DEPRECATED
        hasComments: boolean;
    };
    activeRecording: string;
    createdWithPrompts: boolean = false;*/
    createdAt?: Date;
    updatedAt?: Date;

    constructor() {super()}
}