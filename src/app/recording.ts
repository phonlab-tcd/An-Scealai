import { Story } from "./story";

export class Recording {
    _id: string;
    storyData: Story;
    date: Date;
    paragraphAudioIds: string[];
    paragraphIndices: number[];
    sentenceAudioIds: string[];
    sentenceIndices: number[];

    constructor(paragraphAudioIds, paragraphIndices, sentenceAudioIds, sentenceIndices, story) {
        this.paragraphAudioIds = paragraphAudioIds;
        this.paragraphIndices = paragraphIndices;
        this.sentenceAudioIds = sentenceAudioIds;
        this.sentenceIndices = sentenceIndices;
        this.storyData = story;
        this.date = new Date();
    }
}