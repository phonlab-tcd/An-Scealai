import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivacyPreferencesRoutingModule } from './privacy-preferences-routing.module';
import { PrivacyPreferencesComponent } from './privacy-preferences.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ConsentGroupComponent } from './consent-group/consent-group.component';
import { ConfirmAgeComponent } from './confirm-age/confirm-age.component';
import { TryingToUseFeaturesThatRequireConsentComponent } from './trying-to-use-features-that-require-consent.dialog.component';
import { PleaseSpecifyPrivacyPreferences } from './please-specify-privacy-preferences.dialog.component';
import { TranslationModule } from "../translation/module";

const dialogs = [
  TryingToUseFeaturesThatRequireConsentComponent,
  PleaseSpecifyPrivacyPreferences,
]
@NgModule({
  declarations: [
    PrivacyPreferencesComponent,
    ConsentGroupComponent,
    ConfirmAgeComponent,
    ...dialogs
  ],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatCardModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatSlideToggleModule,
    PrivacyPreferencesRoutingModule,
    TranslationModule,
    MatButtonModule,
  ],
  providers: [],
})
export class PrivacyPreferencesModule { }
