import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from "@angular/material/select";

import { SynthPlayerComponent } from "./synth-player/component";
import { SynthVoiceSelectComponent } from "./synth-voice-select/synth-voice-select.component";
import { SynthItemComponent } from "./synth-item/synth-item.component";
import { SynthService } from "./synth.service";
import { SynthBankService } from "./synth-bank.service";
import { LegacySynthPage } from "./legacy-synth-page/synthesis.component";


@NgModule({
  declarations: [
    SynthPlayerComponent,
    SynthVoiceSelectComponent,
    SynthItemComponent,
    LegacySynthPage,
  ],
  imports: [
    CommonModule,
    MatSelectModule,
  ],
  providers: [
    SynthService,
    SynthBankService,
  ],
  exports: [
    SynthPlayerComponent,
  ]
})
export class SynthModule { }
