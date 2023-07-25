export class FeedbackComment {
  _id: string;
  owner: string;
  storyId: string;
  range: {
    index: number;
    length: number;
  };
  text: string;
  audioId: string;
  lastUpdated: Date;

  constructor(owner: string, range: { index: number; length: number }, storyId: string) {
    this.owner = owner;
    this.range = range;
    this.storyId = storyId;
  }
}
