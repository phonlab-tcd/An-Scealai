import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CredentialsService {
  constructor() { }

  username: string;
  email: string;
  password: string;
  language: 'ga'|'en';
}
