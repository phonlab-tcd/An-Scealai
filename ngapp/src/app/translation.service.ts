import { Injectable } from '@angular/core';
import translation from './translation';
import { AuthenticationService } from './authentication.service';
import { HttpClient } from '@angular/common/http';
import config from 'abairconfig';
import { BehaviorSubject, Observable } from 'rxjs';
import trans_pre from './translation';

export type MessageKey = keyof typeof trans_pre;

const translations = /*iefe*/(()=>{
  const ga = {};
  const en = {};
  for(const k of Object.keys(trans_pre)) {
    ga[k] = trans_pre[k].ga;
    en[k] = trans_pre[k].en;
  }
  return {ga,en};
})();


export enum LANGUAGE {
  ENGLISH = 0,
  IRISH =  1,
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  currentLanguage: LANGUAGE;
  languageCode$ = new BehaviorSubject<"ga"|"en">("ga");


  constructor(private auth : AuthenticationService, private http : HttpClient) { 

  }

  l: any = '';
  baseUrl: string = config.baseurl;

  public message(key: MessageKey) {
    return this.l[key] ?? key;
  }


  initLanguage() {
    if (this.auth.isLoggedIn()) {
      this.getUserLanguageCode().subscribe((res) => {
        this.l = this.getLanguageFromCode(res.language);
        this.languageCode$.next(res.language);
      });
    } else {
      this.l = this.getLanguageFromCode('ga');
    }
  }

  setLanguage(code: 'ga'|'en') {
    this.l = this.getLanguageFromCode(code);
    this.languageCode$.next(code);

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

  getLanguageFromCode(code: 'ga'|'en'): object {
    return translations[code] ?? translations['ga'];
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
