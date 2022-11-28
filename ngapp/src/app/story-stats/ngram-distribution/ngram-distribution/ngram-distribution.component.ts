import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import config from 'abairconfig';

const LIGHT_BLUE = 'rgba(54, 162, 235, 0.2)';
const BLUE = 'rgba(54, 162, 235, 1)';

const STOP_WORDS = ['.', ',', '?', '!', '-', ';', ' ', '\n', '\n\n', ':'];

type CountDict = {key: string; count: number};

@Component({
  selector: 'app-ngram-distribution',
  templateUrl: './ngram-distribution.component.html',
  styleUrls: ['./ngram-distribution.component.scss']
})
export class NgramDistributionComponent implements OnInit {

  // Will count n-grams from this set of strings 'texts'. These will in practice be story texts.
  @Input() texts = [];

  selectedN: number = 1;
  ngramChart: Chart;

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.loadNgramChart();
  }

  ngOnChanges(_) {
    this.loadNgramChart();
  }

  async loadNgramChart() {
    const tokenizationRequests = this.texts.map(text => 
      firstValueFrom(this.http.post<string[]>(config.baseurl + 'nlp/tokenize', {text: text}))
    );
    const tokenResponses = await Promise.all(tokenizationRequests);
    const textsAsTokens = tokenResponses.map(tokens => 
      tokens.filter(token => !STOP_WORDS.includes(token)).map(token => token.toLowerCase())
    );

    // bong <-> bag of n-grams
    const bongRequests = textsAsTokens.map(tokens => 
      firstValueFrom(this.http.post<any>(config.baseurl + 'nlp/bong', {array: tokens, n: this.selectedN}))
    );
    const bongResponses = await Promise.all(bongRequests);
    const ngramCounts = bongResponses.reduce(sumCountDicts, {});
    const sortedNgramCounts = reverseSortObject(ngramCounts);
    const X_DATA = sortedNgramCounts.map(entry => entry.key.replaceAll(',', ' '));
    const Y_DATA = sortedNgramCounts.map(entry => ngramCounts[entry.key]);

    const canvasElem = document.getElementById('ngram-chart') as HTMLCanvasElement;
    const ctx = canvasElem.getContext('2d');
    if (this.ngramChart) { this.ngramChart.destroy(); } // remove if there is some existing chart 
    this.ngramChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: X_DATA,
            datasets: [{
                label: 'Frequency',
                data: Y_DATA,
                backgroundColor: Y_DATA.map(_ => LIGHT_BLUE),
                borderColor: Y_DATA.map(_ => BLUE),
                borderWidth: 1
            }]
        },
        options: {
          scales: {
            yAxes: [{
                display: true,
                stacked: true,
                ticks: {
                    beginAtZero: true,
                    stepSize: 1
                }
            }]
          },
          responsive: true
        }
    });
  }
}

// SOME UTIL FUNCTIONS

function sumCountDicts(A: CountDict, B: CountDict): CountDict {
  const result = A;
  for (const key of Object.keys(B)) {
    if (result.hasOwnProperty(key)) {
      result[key] += B[key];
    } else {
      result[key] = B[key]
    }
  }

  return result;
} 

// https://stackoverflow.com/questions/1069666/sorting-object-property-by-values
function reverseSortObject(obj) {
  var arr = [];
  for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
          arr.push({
              'key': prop,
              'value': obj[prop]
          });
      }
  }
  arr.sort(function(a, b) { return b.value - a.value; });
  return arr
}
