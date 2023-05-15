import { Story } from "./story";

export class Recording {
    _id: string;
    storyData: Story;
    date: Date;
    paragraphAudioIds: string[];
    paragraphIndices: number[];
    paragraphTranscriptions: string[];
    sentenceAudioIds: string[];
    sentenceIndices: number[];
    sentenceTranscriptions: string[];
    archived: boolean;

    constructor(story, paragraphAudioIds=[], paragraphIndices=[], paragraphTranscriptions=[], sentenceAudioIds=[], sentenceIndices=[], sentenceTranscriptions=[]) {
        this.paragraphAudioIds = paragraphAudioIds;
        this.paragraphIndices = paragraphIndices;
        this.paragraphTranscriptions = paragraphTranscriptions;
        this.sentenceAudioIds = sentenceAudioIds;
        this.sentenceIndices = sentenceIndices;
        this.sentenceTranscriptions = sentenceTranscriptions;
        this.storyData = story;
        this.date = new Date();
        this.archived = false;
    }
}