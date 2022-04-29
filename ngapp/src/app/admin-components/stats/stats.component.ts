import { Component, OnInit } from '@angular/core';
import { StatsService } from '../../stats.service';
import { TranslationService } from '../../translation.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  constructor(
    private statsService : StatsService,
    public ts: TranslationService,
  ) { }

  chart: any;
  graphGenerated : boolean = false;
  labelArray: any;
  dataArray: any;
  netErrors : number = 0;

  ngOnInit() {
    this.statsService.getSynthesisData().subscribe((data) => {
      this.labelArray = Object.keys(data);
      this.dataArray = this.labelArray.map((key: string)=>data[key]);
      this.netErrors = this.dataArray.reduce((acc: number,v: number)=>acc+v, 0);
      this.graphGenerated = true;
    });
  }
}
