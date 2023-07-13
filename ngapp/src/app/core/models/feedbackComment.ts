export class FeedbackComment {
  _id: string;
  range: {
    index: number;
    length: number;
  };
  text: string;
  audioId: string;
  storyId: string;
  lastUpdated: Date;

  constructor(range: { index: number; length: number }, storyId: string) {
    this.range = range;
    this.storyId = storyId;
  }
}
