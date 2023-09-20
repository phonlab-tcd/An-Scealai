export class Message {

  constructor(
    public _id: string,
    public subject: string,
    public date: Date,
    public senderId: string,
    public senderUsername: string,
    public recipientId: string,
    public text: string,
    public seenByRecipient: boolean,
    public audioId: string
  ) {}
}
