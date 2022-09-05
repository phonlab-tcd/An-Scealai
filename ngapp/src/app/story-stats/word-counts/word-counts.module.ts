import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordCountsComponent } from './word-counts/word-counts.component';


@NgModule({
  declarations: [
    WordCountsComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    WordCountsComponent
  ]
})
export class WordCountsModule { }
