import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrammarErrorsComponent } from './grammar-errors/grammar-errors.component';



@NgModule({
  declarations: [
    GrammarErrorsComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    GrammarErrorsComponent
  ]
})
export class GrammarErrorsModule { }
