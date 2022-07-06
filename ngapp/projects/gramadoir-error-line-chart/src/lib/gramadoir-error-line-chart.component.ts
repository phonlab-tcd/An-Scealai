import { Component, Input, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChartConfiguration, ChartOptions } from "chart.js";
import { BaseChartDirective } from 'ng2-charts';
import config from '../../../../src/abairconfig';
import { QuillHighlightTag } from '../../../../src/app/services/quill-highlight.service';
const backendUrl = config.baseurl;

type GramadoirCacheLink = {gramadoirCacheId: string; timestamp: Date};
type GramadoirStoryHistory = {
    userId: string;
    storyId: string;
    versions: GramadoirCacheLink[]
};
type GramadoirCacheItem = {
  text: string;
  grammarTags: QuillHighlightTag[];
}

function timeString(v:{timestamp: Date},i: number) {
  const d = new Date(v.timestamp);
  const ts = d.toLocaleTimeString();
  return i % 10 == 0 ?
    d.toLocaleDateString() + ' ' + ts :
    ts;
}

@Component({
  selector: 'gramadior-error-line-chart',
  templateUrl: './gramadoir-error-line-chart.component.html',
  styles: [],
})
export class GramadoirErrorLineChartComponent {
  constructor(private http: HttpClient) {}
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  title = 'ng2-charts-demo';

  storyHistory: GramadoirStoryHistory;

  fetchStoryHistory(httpClient: HttpClient, storyId: string) {
    const url = `${backendUrl}/gramadoir/storyHistory/${storyId}`;
    return httpClient
      .get<GramadoirStoryHistory>(url)
      .toPromise();
  }

  fetchGramadoirCacheItem(httpClient: HttpClient, gramadoirCacheId: string) {
    const url = `${backendUrl}/gramadoir/cache/${gramadoirCacheId}`;
    return httpClient
      .get<GramadoirCacheItem>(url)
      .toPromise();
  }

  private _storyId: string;
  @Input('storyId') set storyId(_storyId:string){
    this._storyId = _storyId;
    (async () => {
      this.storyHistory = await this.fetchStoryHistory(this.http, this._storyId);
      this.lineChartData.labels = this.storyHistory.versions.map(timeString);
      this.chart.chart.update();
    })();
  }

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['a','b','c','d','e','f'],
    datasets: [
      {
        data: [ 65, 59, 80, 81, 56, 55, 40 ],
        label: 'Series B',
        fill: false,
        tension: 0.5,
        borderColor: 'rgba(255,0,0,0.3)',
        backgroundColor: 'rgba(255,0,0,0.3)'
      }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false
  };
  public lineChartLegend = true;
  public lineChartPlugins = [];
}

