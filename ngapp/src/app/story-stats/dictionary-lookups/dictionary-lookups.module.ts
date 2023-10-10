import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DictionaryLookupsComponent } from './dictionary-lookups/dictionary-lookups.component';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    DictionaryLookupsComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    NgbModule
  ], 
  exports: [
      DictionaryLookupsComponent
  ]
})
export class DictionaryLookupsModule { }