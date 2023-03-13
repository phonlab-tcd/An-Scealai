export class Message {
    _id: string;
    subject: string;
    date: Date;
    senderId: string;
    senderUsername: string;
    recipientId: string;
    text: string;
    seenByRecipient: Boolean;
    audioId: string;
}