import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DictionaryLookupsComponent } from './dictionary-lookups/dictionary-lookups.component';
import { MatCardModule } from '@angular/material/card'

@NgModule({
  declarations: [
    DictionaryLookupsComponent
  ],
  imports: [
    CommonModule,
    MatCardModule
  ], 
  exports: [
      DictionaryLookupsComponent
  ]
})
export class DictionaryLookupsModule { }
