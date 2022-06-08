import { Serializable } from "./serializable";
import { SanitizedUser } from '@api/src/endpoint/user/searchUser';

export class User extends Serializable {
  constructor(u: SanitizedUser) {
    super();
    this._id      = u._id;
    this.username = u.username;
    this.role     = u.role;
    this.language = u.language;
    this.status   = u.status;
  }

  _id: string;
  username: string;
  role: string;
  language: string;
  status: 'Active' | 'Pending';
}
