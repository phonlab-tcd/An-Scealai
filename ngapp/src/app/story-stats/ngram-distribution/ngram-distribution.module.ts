import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { NgramDistributionComponent } from './ngram-distribution/ngram-distribution.component';


@NgModule({
  declarations: [
    NgramDistributionComponent
  ],
  imports: [
    CommonModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
  ],
  exports: [
    NgramDistributionComponent
  ]
})
export class NgramDistributionModule { }
