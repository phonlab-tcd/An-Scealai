import { Component, OnInit } from '@angular/core';
import { SingletonService } from './singleton.service';

@Component({
  selector: 'privacy-preferences',
  templateUrl: './privacy-preferences.component.html',
  styleUrls: ['./style.scss'],
  host: { class: "centeredA4" },
})
export class PrivacyPreferencesComponent {
  constructor() { }
}
