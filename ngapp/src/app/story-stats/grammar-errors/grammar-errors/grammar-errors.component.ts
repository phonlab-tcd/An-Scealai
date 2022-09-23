import { Component, OnInit, Input } from "@angular/core";
import { Chart } from "chart.js";

@Component({
  selector: "app-grammar-errors",
  templateUrl: "./grammar-errors.component.html",
  styleUrls: ["./grammar-errors.component.scss"],
})
export class GrammarErrorsComponent implements OnInit {
  constructor() {}

  @Input() data:any;
  chart: any;

  async ngOnInit() {
    await this.makeCharts();
  }

  // create a time series chart for a student's grammar erros
  private async makeCharts() {
    let labels = new Set<string>();
    let datasets = [];

    // loop through each error and create data structures for chart
    for (let [key, value] of Object.entries(this.data)) {
      Object.keys(value).forEach((item) => labels.add(item));
      let dict = {
        label: key,
        data: Object.values(value),
        borderColor: "#" + ((Math.random() * 0xffffff) << 0).toString(16),
        fill: false,
      };
      datasets.push(dict);
    }

    let canvasElem = document.getElementById("grammar-errors-chart") as HTMLCanvasElement;
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
