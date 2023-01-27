import { Component, OnInit, Input } from '@angular/core';
import { Chart } from "chart.js";
import { TranslationService } from '../../../translation.service';
import { ERROR_INFO} from '../../../lib/grammar-engine/types';

@Component({
  selector: 'app-grammar-error-time',
  templateUrl: './grammar-error-time.component.html',
  styleUrls: ['./grammar-error-time.component.scss']
})
export class GrammarErrorTimeComponent implements OnInit {

  constructor(private ts: TranslationService) { }
  
  @Input() grammarErrorTimeCounts: Object[];
  chart: Chart;
  legendItems: any[] = [];

  async ngOnInit() {
    // await this.makeCharts();
  }
  
  ngOnChanges(_) {
    if(this.grammarErrorTimeCounts) {
      this.makeCharts();
    }
  }
  
  // create a time series chart for a student's grammar erros
  private async makeCharts() {
    if (this.chart) { this.chart.destroy(); }
    let labels = new Set<string>();
    let datasets = [];

    // loop through each error and create data structures for chart
    for(let entry of this.grammarErrorTimeCounts) {
      console.log(entry)
      for (let [key, value] of Object.entries(entry)) {
        Object.keys(value).forEach((item) => labels.add(item)); // loop through each timestamp
        let dict = {
          label: this.ts.currentLanguage? ERROR_INFO[key].nameGA : ERROR_INFO[key].nameEN , // Error name
          data: Object.values(value),  // {timestamp: count}
          borderColor: ERROR_INFO[key].color,
          fill: false,
        };
        datasets.push(dict);
      }
      
    }


    let canvasElem = document.getElementById("grammar-errors-time-chart") as HTMLCanvasElement;
    let ctx = canvasElem.getContext("2d");
    this.chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: Array.from(labels),
        datasets: datasets,
      },
      options: {
        legend: {
          display: false,
        },
        scales: {
          yAxes: [{
            ticks: {
              stepSize: 1
            }
          }]
        }
      }
    });
    
    this.legendItems = this.chart['legend']['legendItems'];
  }

}
