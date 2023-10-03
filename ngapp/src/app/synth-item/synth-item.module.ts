import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SynthItemComponent } from './synth-item.component';

@NgModule({
  declarations: [SynthItemComponent],
  imports: [CommonModule],
  exports: [SynthItemComponent]  
})
export class SynthItemModule {}