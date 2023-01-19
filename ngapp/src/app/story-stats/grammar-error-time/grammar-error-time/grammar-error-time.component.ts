import { Component, OnInit, Input } from '@angular/core';
import { Chart } from "chart.js";

@Component({
  selector: 'app-grammar-error-time',
  templateUrl: './grammar-error-time.component.html',
  styleUrls: ['./grammar-error-time.component.scss']
})
export class GrammarErrorTimeComponent implements OnInit {

  constructor() { }
  
  @Input() grammarErrorTimeCounts: Object[];
  chart: Chart;

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
    for (let [key, value] of Object.entries(this.grammarErrorTimeCounts)) {
      Object.keys(value).forEach((item) => labels.add(item)); // loop through each timestamp
      let dict = {
        label: key, // Error name
        data: Object.values(value),  // {timestamp: count}
        borderColor: "#" + ((Math.random() * 0xffffff) << 0).toString(16),
        fill: false,
      };
      datasets.push(dict);
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
        scales: {
          yAxes: [{
            ticks: {
              stepSize: 1
            }
          }]
        }
      }
    });
  }

}
