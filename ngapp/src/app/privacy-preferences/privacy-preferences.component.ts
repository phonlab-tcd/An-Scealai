import { Component } from '@angular/core';
import { consentKey } from "./consent.service";

@Component({
  selector: 'privacy-preferences',
  templateUrl: './privacy-preferences.component.html',
  styleUrls: ['./style.scss'],
})
export class PrivacyPreferencesComponent {
  consentKey = consentKey;
}
