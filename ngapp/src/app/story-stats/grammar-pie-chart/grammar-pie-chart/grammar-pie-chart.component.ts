import { Component, OnInit, Input } from '@angular/core';
import { TranslationService } from '../../../translation.service';
import { Chart } from 'chart.js';
import { ERROR_INFO} from '../../../lib/grammar-engine/types';

@Component({
  selector: 'app-grammar-pie-chart',
  templateUrl: './grammar-pie-chart.component.html',
  styleUrls: ['./grammar-pie-chart.component.scss']
})
export class GrammarPieChartComponent implements OnInit {
  
  @Input() errorCounts: {[type: string]: number} = {};
  pieChart: Chart;
  legendItems: any[] = [];

  constructor(
    private ts: TranslationService
  ) { }

  ngOnInit(): void {
    //this.loadPieChart();
  }

  ngOnChanges(changes: any) {
    this.loadPieChart();
  }
  
  private loadPieChart() {
    
    let canvasElem = document.getElementById("grammar-pie-chart") as HTMLCanvasElement;
    let ctx = canvasElem.getContext('2d');
    if (this.pieChart) { this.pieChart.destroy(); } 
    this.pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(this.errorCounts),
            datasets: [{
                label: 'Grammar Error Counts ',
                data: Object.values(this.errorCounts),
                backgroundColor: Object.keys(this.errorCounts).map( err => ERROR_INFO[err].color),
            }]
        },
        options: {
          plugins: {
            legend: {
              display: false,
            }
          }

        },
    });

    this.legendItems = this.pieChart['legend']['legendItems'];
  }

    /**
   * Toggle legend item on/off on the legend and chart when clicked
   * @param legendItem clicked legend item
   * @param event clicked event
   */
    updateLegend(legendItem: any, event: any) {
      this.pieChart.toggleDataVisibility(legendItem.index);
      event.target.parentNode.classList.toggle('hideLegendItem');;
      this.pieChart.update();
    }

}
