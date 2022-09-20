import { Component, OnInit } from "@angular/core";
import { Chart } from "chart.js";
import { firstValueFrom } from "rxjs";
import { UserService } from "../../../user.service";

const LIGHT_RED = "rgba(255, 204, 203, 1)";
const RED = "rgba(255, 114, 111, 1)";

@Component({
  selector: "app-grammar-errors",
  templateUrl: "./grammar-errors.component.html",
  styleUrls: ["./grammar-errors.component.scss"],
})
export class GrammarErrorsComponent implements OnInit {
  constructor(private userService: UserService) {}

  studentErrors: any;
  stats: any[] = [];
  charts: any[] = [];

  async ngOnInit() {
    await this.getStats();
    await this.makeCharts();
  }

  // Get grammar errors for each student
  private async getStats() {
    this.studentErrors = await firstValueFrom(
      this.userService.getGrammarErrors("id number")
    );
    console.log(this.studentErrors);
  }

  // create a time series chart for a student's grammar erros
  private async makeCharts() {
    let labels = new Set<string>();
    let datasets = [];
    let i = 0;

    // loop through each error and create data structures for chart
    for (let [key, value] of Object.entries(this.studentErrors)) {
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
    const chart = new Chart(ctx, {
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
