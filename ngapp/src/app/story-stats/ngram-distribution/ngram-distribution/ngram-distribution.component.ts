import { Component, OnInit, Input } from '@angular/core';
import { Chart } from 'chart.js';

import * as Wink from 'wink-nlp';
import * as Model from 'wink-eng-lite-web-model';
import * as NLPUtils from 'wink-nlp-utils';

const nlp = Wink.default(Model.default)

const LIGHT_BLUE = 'rgba(54, 162, 235, 0.2)';
const BLUE = 'rgba(54, 162, 235, 1)';

const STOP_WORDS = ['.', ',', '?', '!'];

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

  constructor() { }

  ngOnInit(): void {
    this.loadNgramChart();
  }

  loadNgramChart() {
    console.log('loadNgramChart running');
    const allTextsAsTokens = this.texts.map(text =>
      nlp.readDoc(text).tokens().out() // this converts text -> array of tokens
        .filter(token => !STOP_WORDS.includes(token))
        .map(token => token.toLowerCase())
    );

    const ngramCounts = allTextsAsTokens
      .map(tokens => NLPUtils.string.bong(tokens, this.selectedN)) // bong <-> bag of n-grams :^)
      .reduce(sumCountDicts, {});

    const sortedNgramCounts = reverseSortObject(ngramCounts);
    console.log('sorted', sortedNgramCounts);
    
    const X_DATA = sortedNgramCounts.map(entry => entry.key.replace(',', ' '));
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
          }
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
