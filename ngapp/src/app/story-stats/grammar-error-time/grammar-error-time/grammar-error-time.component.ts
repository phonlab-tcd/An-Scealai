import { Component, OnInit, Input } from "@angular/core";
import { Chart } from "chart.js";
import { TranslationService } from "../../../translation.service";
import { ERROR_INFO } from "../../../lib/grammar-engine/types";
import "chartjs-adapter-date-fns";

@Component({
  selector: "app-grammar-error-time",
  templateUrl: "./grammar-error-time.component.html",
  styleUrls: ["./grammar-error-time.component.scss"],
})
export class GrammarErrorTimeComponent implements OnInit {
  constructor(private ts: TranslationService) {}

  @Input() grammarErrorTimeCounts: Object[];
  timeSeriesChart: Chart;
  legendItems: any[] = [];
  timeRange: string[] = [];

  async ngOnInit() {
    this.createDateRange();
    this.makeChart();
  }

  /**
   * This function gets called when any new data is sent to the component
   */
  ngOnChanges(_) {
    if (this.grammarErrorTimeCounts) {
      this.ngOnInit();
    }
  }

  /**
   * Create an array of dates from today - x days
   */
  createDateRange() {
    const NUM_OF_DAYS = 30; // get last 30 dates.
    for (let i = 0; i < NUM_OF_DAYS; i++) {
      let date = new Date();
      date.setDate(date.getDate() - i);
      this.timeRange.push(date.toISOString().split("T")[0]);
    }
  }

  /**
   * Create a time series chart for student grammar erros over a given date range
   */
  private async makeChart() {
    // get the processed data
    let dateAndCountData = this.calculateDataForChart();

    let canvasElem = document.getElementById("grammar-errors-time-chart") as HTMLCanvasElement;
    let ctx = canvasElem.getContext("2d");
    if (this.timeSeriesChart) { this.timeSeriesChart.destroy();}

    this.timeSeriesChart = new Chart(ctx, {
      type: "line",
      data: {
        datasets: dateAndCountData,
      },
      options: {
        plugins: {
          legend: {
            display: true,
            position: "left",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
          x: {
            type: "time",
            time: {
              unit: "day",
            },
          },
        },
      },
    });

    this.legendItems = this.timeSeriesChart["legend"]["legendItems"];
  }

  /**
   * Processes the data to put it into a format usable by the chart
   * @returns array of data objects
   */
    calculateDataForChart() {
      let datasets = []; // one dataset for each error name
  
      // loop through each error and create data object for chart
      for (let entry of this.grammarErrorTimeCounts) { // one entry for each student
        for (let [key, value] of Object.entries(entry)) {  // key is error name, value is object of timestamps and counts
          let dict = {
            label: this.ts.currentLanguage ? ERROR_INFO[key].nameGA : ERROR_INFO[key].nameEN, // Error name
            data: this.createDateAndCountArray(value), // [{day1: count}, {day2: count}, ...] for each day in the date range
            borderColor: ERROR_INFO[key].color,
            backgroundColor: ERROR_INFO[key].color,
            fill: false,
          };
          datasets.push(dict);
        }
      }
      return datasets;
    }

  /**
   * Takes an error with a certain number of dates and counts and padds the object by
   * filling in the gaps where the object doesn't have a particular date
   * i.e. every error will have the same number of entries as the length of 
   * the timeRange array (one entry for each day), no matter the starting size
   * e.x. data before: Seimhu: [{day9: count}, {day15: count}]
   * e.x. data after:  Seimhu: [{day1: count}, {day2: count}, {day3: count}, ...]
   * @param error object with dates and error counts
   * @returns an object with dates and error counts for the given time range
   */
  createDateAndCountArray(error: Object) {
    let finalResult = {};
    this.timeRange.reverse().forEach((date) => {
      // error does not have a count for this date
      if (!error.hasOwnProperty(date)) {
        finalResult[date] = 0; // can either use null or 0, whichever looks cleaner on the chart
      }
      // error does have a count for this date
      else {
        finalResult[date] = error[date];
      }
    });
    return finalResult;
  }
}
