export class Story {
    _id: string;
    id: string;
    title: string;
    date: Date;
    dialect: string;
    text: string;
    author: string;
    feedback: {
        seenByStudent: boolean;
        text: string;
        audioId: string;
    };
}