import { Serializable } from 'ts-serializable';

export class User extends Serializable {
    '_id': string;
    username: string;
    role: string;
    language: string;
}
