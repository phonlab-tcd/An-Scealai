import { Component } from '@angular/core';
import { TranslationService } from 'app/translation.service';

@Component({
  selector: 'app-trying-to-use-features-that-require-consent',
  template: `
    <div mat-dialog-content>
      <transl [key]="'trying_to_use_feature_that_requires_consent'"></transl>
    </div>
    <div mat-dialog-close routerLink="/privacy-preferences">
      <transl [key]="'go_to_privacy_preferences_page'"></transl>
    </div>
    <div mat-dialog-actions>
      <button mat-button mat-dialog-close routerLink="/privacy-preferences">
        <transl key=ok></transl>
      </button>
    </div>
  `
})
export class TryingToUseFeaturesThatRequireConsentComponent {
  constructor() { }
}
