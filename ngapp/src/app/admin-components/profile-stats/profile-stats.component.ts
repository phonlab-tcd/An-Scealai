import { Component, OnInit } from '@angular/core';
import { StatsService } from '../../stats.service';

@Component({
  selector: 'app-profile-stats',
  templateUrl: './profile-stats.component.html',
  styleUrls: ['./profile-stats.component.css']
})
export class ProfileStatsComponent implements OnInit {

  constructor(private statsService : StatsService) { }

  ngOnInit(): void {
    let startDate = new Date('1995-12-17T03:24:00');
    let endDate = new Date('2022-12-17T03:24:00');
    console.log("Call stats service with: ", startDate, " ", endDate);
    //this.statsService.getProfileDataByDate(startDate.toString(), endDate.toString());
    this.statsService.statTest();
  }

}
