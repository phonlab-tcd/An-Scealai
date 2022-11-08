import { Story } from "./story";

export class Recording {
    _id: string;
    storyData: Story;
    date: Date;
    paragraphAudioIds: string[];
    paragraphIndices: number[];
    sentenceAudioIds: string[];
    sentenceIndices: number[];
    archived: boolean;

    constructor(story, paragraphAudioIds=[], paragraphIndices=[], sentenceAudioIds=[], sentenceIndices=[]) {
        this.paragraphAudioIds = paragraphAudioIds;
        this.paragraphIndices = paragraphIndices;
        this.sentenceAudioIds = sentenceAudioIds;
        this.sentenceIndices = sentenceIndices;
        this.storyData = story;
        this.date = new Date();
        this.archived = false;
    }
}