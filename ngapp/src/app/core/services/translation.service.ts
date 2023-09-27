import { Injectable } from "@angular/core";
import { AuthenticationService } from "app/core/services/authentication.service";
import { HttpClient } from "@angular/common/http";
import config from "abairconfig";
import { Observable, firstValueFrom } from "rxjs";
import trans_pre from "../../translation";

export type MessageKey = keyof typeof trans_pre;

// stores all Irish and English tranlsations from translations.ts
const translations = /*iefe*/ (() => {
  const ga = {}; // stores all ga translations
  const en = {}; // stores all en translations
  // loop through each key in translations.ts to divide en/ga translations into their own objects
  for (const k of Object.keys(trans_pre)) {
    ga[k] = trans_pre[k].ga;
    en[k] = trans_pre[k].en;
  }
  return { ga, en };
})();

@Injectable({
  providedIn: "root",
})
export class TranslationService {
  // used to store en or ga translations
  l: any = "";
  baseUrl: string = config.baseurl;

  constructor(private auth: AuthenticationService, private http: HttpClient) {}

  /**
   * Set language preference from user object once logged in,
   * otherwise init the site to Irish (called in app.component)
   */
  async initLanguage() {
    const storedToken = localStorage.getItem("languagePreference");
    if (storedToken && storedToken === 'en') {
      this.l = this.getTranslationsFromCode(storedToken)
    }
    else {
      this.l = this.getTranslationsFromCode("ga");
    }
    /*
    if (this.auth.isLoggedIn()) {
      let res = await firstValueFrom(this.getUserLanguageCode()); // Language choice not persisted, do we want to do this instead?
      if (res) this.l = this.getTranslationsFromCode(res.language);
      else this.l = this.getTranslationsFromCode("ga");
    } else {
      this.l = this.getTranslationsFromCode("ga");
    }
    */
  }

  /**
   * Set current language setting based on iso code
   * @param code either ga or en
   */
  setLanguage(code: "ga" | "en") {
    // get all translations for given code
    this.l = this.getTranslationsFromCode(code);
    localStorage.setItem("languagePreference", code);

    // update user language preference
    if (this.auth.isLoggedIn()) {
      this.updateUserLanguage(code).subscribe(); // Is this actually working?
    }
  }

  /**
   * Gets the translation of a given key for the current site langauge
   * @param key key corresponding to one listed in translation.ts
   * @returns The en or ga translation of the key
   */
  public message(key: MessageKey) {
    return this.l[key] ?? key;
  }

  /**
   * See if page is in Irish
   * @returns true if current langauge is Irish, otherwise false
   */
  inIrish(): boolean {
    return this.l.name === "Gaeilge";
  }

  /**
   * See if page is in English
   * @returns true if current langauge is English, otherwise false
   */
  inEnglish(): boolean {
    return this.l.name === "English";
  }

  /**
   * Get all translations for either English or Irish
   * @param code either iso code ga or en
   * @returns object of either en or ga translations
   */
  getTranslationsFromCode(code: "ga" | "en"): object {
    return translations[code] ?? translations["ga"];
  }

  /**
   * Get the langauge the site is currently in
   * @returns string (English/Gaeilge) for language site is currently in
   */
  getCurrentLanguage(): string {
    if (this.l) {
      return this.l.name;
    } else {
      this.setLanguage("ga");
      return "Gaeilge";
    }
  }

  /**
   * Update the current user's langauge preference in the DB
   * @param code en or ga
   */
  updateUserLanguage(code: string): Observable<any> {
    const user = this.auth.getUserDetails();
    if (!user) throw new Error("Can't udate user language, user is null");
    return this.http.post(
      this.baseUrl + "user/setLanguage/" + user._id,
      { language: code }
    );
  }

  /**
   * Get the current user's language preference from the DB
   */
  getUserLanguageCode(): Observable<any> {
    const user = this.auth.getUserDetails();
    if (!user) throw new Error("Can't get user language code, user is null")
    return this.http.get(
      this.baseUrl + "user/getLanguage/" + user._id
    );
  }
}
