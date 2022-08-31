import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgramDistributionComponent } from './ngram-distribution/ngram-distribution.component';


@NgModule({
  declarations: [
    NgramDistributionComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    NgramDistributionComponent
  ]
})
export class NgramDistributionModule { }
