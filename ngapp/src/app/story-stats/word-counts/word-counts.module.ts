import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordCountsComponent } from './word-counts/word-counts.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';



@NgModule({
  declarations: [
    WordCountsComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    BrowserModule,
    BrowserAnimationsModule
  ],
  exports: [
    WordCountsComponent
  ]
})
export class WordCountsModule { }