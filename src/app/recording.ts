export class Recording {
    _id: string;
    userId: string;
    storyData: Object;
    date: Date;
    addedToHistory: boolean;
    paragraphAudioIds: Map<string, string> = new Map();
    sentenceAudioIds: Map<string, string> = new Map();
}