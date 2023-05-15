import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrammarPieChartComponent } from './grammar-pie-chart/grammar-pie-chart.component';

@NgModule({
  declarations: [
    GrammarPieChartComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    GrammarPieChartComponent
  ]
})
export class GrammarPieChartModule { }