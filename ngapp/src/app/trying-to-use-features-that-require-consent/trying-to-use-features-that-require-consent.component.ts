import { Component } from '@angular/core';
import { TranslationService } from 'app/translation.service';

@Component({
  selector: 'app-trying-to-use-features-that-require-consent',
  templateUrl: './trying-to-use-features-that-require-consent.component.html',
  styleUrls: ['./trying-to-use-features-that-require-consent.component.scss']
})
export class TryingToUseFeaturesThatRequireConsentComponent {

  constructor(
    public ts: TranslationService
    ) { }
}
