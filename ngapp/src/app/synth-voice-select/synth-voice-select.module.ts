import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { SynthVoiceSelectComponent } from './synth-voice-select.component';

@NgModule({
  declarations: [SynthVoiceSelectComponent],
  imports: [CommonModule, MatSelectModule],
  exports: [SynthVoiceSelectComponent]  
})
export class SynthVoiceSelectModule {}