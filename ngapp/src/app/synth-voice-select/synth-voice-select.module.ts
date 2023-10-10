import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { SynthVoiceSelectComponent } from './synth-voice-select.component';

@NgModule({
  declarations: [SynthVoiceSelectComponent],
  imports: [CommonModule, MatSelectModule],
  exports: [SynthVoiceSelectComponent]  
})
export class SynthVoiceSelectModule {}