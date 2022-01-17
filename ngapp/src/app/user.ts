import { Serializable } from "./serializable";

export class User extends Serializable {
    _id: string;
    username: string;
    role: string;
    language: string;
}
