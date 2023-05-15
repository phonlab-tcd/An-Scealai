import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrammarErrorTimeComponent } from './grammar-error-time/grammar-error-time.component';



@NgModule({
  declarations: [
    GrammarErrorTimeComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    GrammarErrorTimeComponent
  ]
})
export class GrammarErrorTimeModule { }