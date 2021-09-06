import { Injectable } from '@angular/core';
import translation from './translation.json';
import { AuthenticationService } from './authentication.service';
import { HttpClient } from '@angular/common/http';
import config from '../abairconfig.json';
import { Observable } from 'rxjs';

export enum LANGUAGE {
  ENGLISH = 0,
  IRISH =  1,
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  currentLanguage: LANGUAGE;

  constructor(private auth : AuthenticationService, private http : HttpClient) { }

  l: any = '';
  baseUrl: string = config.baseurl;

  initLanguage() {
    if (this.auth.isLoggedIn()) {
      this.getUserLanguageCode().subscribe((res) => {
        this.l = this.getLanguageFromCode(res.language);
      });
    } else {
      this.l = this.getLanguageFromCode('ga');
    }
  }

  setLanguage(code: string) {
    this.l = this.getLanguageFromCode(code);

    this.currentLanguage = (this.l.iso_code === 'en' ? LANGUAGE.ENGLISH : LANGUAGE.IRISH);

    if (this.auth.isLoggedIn()) {
      this.updateUserLanguage(code).subscribe();
    }
  }

  inIrish() : boolean {
    return (this.l.name === "Gaeilge");
  }

  inEnglish() : boolean {
    return (this.l.name === "English");
  }

  getLanguageFromCode(code: string): object {
    for (const language of translation.languages) {
      if (language.iso_code === code) {
        return language;
      }
    }
    return null;
  }
  
  getCurrentLanguage() : string {
    if(this.l) {
      return this.l.name;
    }
    else {
      this.setLanguage('ga');
      return "Gaeilge";
    }
    
  }

  updateUserLanguage(code : string) : Observable<any> {
    return this.http.post(this.baseUrl + "user/setLanguage/" + this.auth.getUserDetails()._id, {language : code});
  }

  getUserLanguageCode() : Observable<any> {
    return this.http.get(this.baseUrl + "user/getLanguage/" + this.auth.getUserDetails()._id);
  }

}
