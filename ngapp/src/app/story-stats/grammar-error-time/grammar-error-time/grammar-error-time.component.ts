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

  @Input() grammarErrorTimeCounts: {startDate: Date, endDate: Date, data: Object[]};;
  timeSeriesChart: Chart;
  legendItems: any[] = [];
  dateRange: string[] = [];

  async ngOnInit() {
  }

  /**
   * This function gets called when any new data is sent to the component
   */
  ngOnChanges(_) {
    if (this.grammarErrorTimeCounts) {
      this.createDateRange();
      this.makeChart();
    }
  }

  /**
   * Create an array of dates from today - x days
   */
  createDateRange() {
    this.dateRange = [];
    let numOfDays = 30; // default date range length if no dates given
    let endDate = new Date(); // initial date for calculating range, default today (calc begins with most recent date, i.e. end)

    // get date range from given start and end date
    if (this.grammarErrorTimeCounts.startDate && this.grammarErrorTimeCounts.endDate) {
      let dateDifference = this.grammarErrorTimeCounts.endDate.getTime() - this.grammarErrorTimeCounts.startDate.getTime();
      let totalDays = (Math.ceil(dateDifference / (1000 * 3600 * 24))) + 1; // add 1 to get full last day
      if (totalDays) {
        numOfDays = totalDays;
        endDate = this.grammarErrorTimeCounts.endDate;
      }
    }
    for (let i = 0; i < numOfDays; i++) {
      let date = new Date(endDate);
      date.setDate(date.getDate() - i);
      this.dateRange.push(date.toISOString().split("T")[0]);
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
    if (this.timeSeriesChart) { this.timeSeriesChart.destroy(); }

    this.timeSeriesChart = new Chart(ctx, {
      type: "line",
      data: {
        datasets: dateAndCountData,
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            title: {
              display: true,
              text: 'Num of errors'
            },
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
    let dataset: Object = {}; // one entry for each error name

    // loop through each error for each student in data and add error counts to the dataset
    for (let studentEntry of this.grammarErrorTimeCounts.data) {                // one entry for each student
      for (let [errorName, timeData] of Object.entries(studentEntry)) {        // errorName is error name, timeData is object of timestamps and counts
         // if error already exists in the dataset, add counts to existing data object 
        if (errorName in dataset) {                                            
          Object.keys(dataset[errorName].data).forEach((date) => {
            if (date in timeData) {
              dataset[errorName].data[date] =
                dataset[errorName].data[date] + timeData[date];    // add this student's counts to counts already in the dataset for that error
            }
          });
        } else {
          // otherwise create new data object for that error
          let dict = {
            label: this.ts.inIrish() ? ERROR_INFO[errorName].nameGA : ERROR_INFO[errorName].nameEN, // Error name
            data: this.createDateAndCountArray(timeData), // [{day1: count}, {day2: count}, ...] for each day in the date range
            borderColor: ERROR_INFO[errorName].color,
            backgroundColor: ERROR_INFO[errorName].color,
            fill: false,
          };
          dataset[errorName] = dict;
        }
      }
    }
    return Object.values(dataset);
  }

  /**
   * Takes an error with a certain number of dates and counts and padds the object by
   * filling in the gaps (with 0/null) where the object doesn't have a particular date
   * i.e. every error will have the same number of entries as the length of
   * the dateRange array (one entry for each day), no matter the starting size
   * e.x. data before: Seimhu: {day9: count, day15: count}
   * e.x. data after:  Seimhu: {day1: count, day2: count, day3: count, ... }
   * @param error object with dates and error counts
   * @returns an object with dates and error counts for the given time range
   */
  createDateAndCountArray(error: Object) {
    let finalResult = {};
    this.dateRange.reverse().forEach((date) => {
      // error does not have a count for this date
      if (!error.hasOwnProperty(date)) {
        finalResult[date] = null; // can either use null or 0, whichever looks cleaner on the chart
      }
      // error does have a count for this date
      else {
        finalResult[date] = error[date];
      }
    });
    return finalResult;
  }

  /**
   * Toggle legend item on/off on the legend and chart when clicked
   * @param legendItem clicked legend item
   * @param event clicked event
   */
  updateLegend(legendItem: any, event: any) {
    const index = legendItem.datasetIndex;
    const isHidden = !this.timeSeriesChart.isDatasetVisible(index);
    this.timeSeriesChart.setDatasetVisibility(index, isHidden);
    event.target.parentNode.classList.toggle('hideLegendItem');;
    this.timeSeriesChart.update();
  }
}
