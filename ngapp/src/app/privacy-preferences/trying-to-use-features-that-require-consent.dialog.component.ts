import { Component } from '@angular/core';
import { TranslationService } from 'app/translation.service';

@Component({
  selector: 'app-trying-to-use-features-that-require-consent',
  template: `
  <div mat-dialog-content>
    {{ ts.message('trying_to_use_feature_that_requires_consent') }}
  </div>
  <div mat-dialog-close routerLink="/privacy-preferences">
    {{ ts.message('go_to_privacy_preferences_page') }}
  </div>
  `
})
export class TryingToUseFeaturesThatRequireConsentComponent {

  constructor(
    public ts: TranslationService
    ) { }
}
