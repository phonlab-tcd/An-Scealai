import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transl } from "./transl.component";

@NgModule({
  declarations: [
    Transl,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    Transl,
  ]
})
export class TranslationModule { }
