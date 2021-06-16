export class Story {
    _id: string;
    title: string;
    date: Date;
    lastUpdated: Date;
    dialect: string;
    text: string;
    author: string;
    studentId: string;
    feedback: {
        seenByStudent: boolean;
        text: string;
        audioId: string;
    };
    activeRecording: string;
}