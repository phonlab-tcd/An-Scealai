import { NgModule } from '@angular/core';
import { GramadoirErrorLineChartComponent } from './gramadoir-error-line-chart.component';
import { NgChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [
    GramadoirErrorLineChartComponent
  ],
  imports: [
    NgChartsModule,
  ],
  exports: [
    GramadoirErrorLineChartComponent
  ]
})
export class GramadoirErrorLineChartModule { }
