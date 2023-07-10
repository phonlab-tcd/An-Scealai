export class FeedbackComment {
  range: {
    index: number,
    length: number
  };
  comment: string;
  constructor(range: {index: number, length: number}, comment: string) {
    this.range = range;
    this.comment = comment;
  }
}
