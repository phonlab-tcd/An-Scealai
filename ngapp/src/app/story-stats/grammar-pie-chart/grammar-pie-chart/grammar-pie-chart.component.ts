import { Component, OnInit, Input } from '@angular/core';
import { TranslationService } from '../../../translation.service';
import { Chart } from 'chart.js';

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
                // TODO: replace these colours with correct gramadoir error colour-coding
                backgroundColor: Object.keys(this.errorCounts).map(_ => `#${((Math.random() * 0xffffff) << 0).toString(16)}`),
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

}
