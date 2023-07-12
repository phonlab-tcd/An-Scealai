export class FeedbackComment {
  _id: string;
  range: {
    index: number;
    length: number;
  };
  text: string;
  audioId: string;
  lastUpdated: Date;
  constructor(range: { index: number; length: number }) {
    this.range = range;
  }
}
