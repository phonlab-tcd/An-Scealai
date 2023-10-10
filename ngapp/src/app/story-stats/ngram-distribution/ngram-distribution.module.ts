import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
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