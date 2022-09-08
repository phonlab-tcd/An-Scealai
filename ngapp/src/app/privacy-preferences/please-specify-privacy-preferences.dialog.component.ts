import { Component } from "@angular/core";
import { TranslationService } from "../translation.service";

@Component({
    selector: 'please-specify-privacy-preferences',
    template: `
      <div mat-dialog-content>
        <transl key=go_to_privacy_preferences_page></transl>
      </div>
      <div mat-dialog-actions>
        <button mat-button mat-dialog-close routerLink="/privacy-preferences">
          <transl key=ok></transl>
        </button>
      </div>
    `,
  
  })
  export class PleaseSpecifyPrivacyPreferences {
    constructor() {}
  }