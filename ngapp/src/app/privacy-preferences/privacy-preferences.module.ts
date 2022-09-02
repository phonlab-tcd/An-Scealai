import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivacyPreferencesRoutingModule } from './privacy-preferences-routing.module';
import { PrivacyPreferencesComponent } from './privacy-preferences.component';
import { SingletonService } from './singleton.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ConsentGroupComponent } from './consent-group/consent-group.component';
import { ConfirmAgeComponent } from './confirm-age/confirm-age.component';
import { TryingToUseFeaturesThatRequireConsentComponent } from '../trying-to-use-features-that-require-consent/trying-to-use-features-that-require-consent.component';

@NgModule({
  declarations: [
    PrivacyPreferencesComponent,
    ConsentGroupComponent,
    ConfirmAgeComponent,
    TryingToUseFeaturesThatRequireConsentComponent
  ],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatCardModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatSlideToggleModule,
    PrivacyPreferencesRoutingModule,
  ],
  providers: [],
})
export class PrivacyPreferencesModule { }
