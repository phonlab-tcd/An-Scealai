export class FeedbackComment {
  range: {
    index: number,
    length: number
  };
  text: string;
  constructor(range: {index: number, length: number}, text: string) {
    this.range = range;
    this.text = text;
  }
}
