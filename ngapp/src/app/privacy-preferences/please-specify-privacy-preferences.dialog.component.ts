import { Component } from "@angular/core";
import { TranslationService } from "../translation.service";

@Component({
    selector: 'please-specify-privacy-preferences',
    template: `
      <div mat-dialog-content>
        {{ ts.message('go_to_privacy_preferences_page') }}
      </div>
      <div mat-dialog-actions>
        <button mat-button mat-dialog-close routerLink="/privacy-preferences">
          Ok
        </button>
      </div>
    `,
  
  })
  export class PleaseSpecifyPrivacyPreferences {
    constructor(public ts: TranslationService) {}
  }