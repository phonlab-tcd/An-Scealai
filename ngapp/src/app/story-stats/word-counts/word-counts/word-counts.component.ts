import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { firstValueFrom } from 'rxjs';
import { StoryService } from '../../../story.service';
import { AuthenticationService } from '../../../authentication.service';
import { ClassroomService } from '../../../classroom.service';
import { UserService } from '../../../user.service';


const LIGHT_RED = 'rgba(255, 204, 203, 1)';
const RED = 'rgba(255, 114, 111, 1)';


@Component({
  selector: 'app-word-counts',
  templateUrl: './word-counts.component.html',
  styleUrls: ['./word-counts.component.scss']
})

export class WordCountsComponent implements OnInit {

  constructor(private storyService: StoryService, private auth: AuthenticationService,
  private classroomService: ClassroomService, private userService: UserService) { }
  
  classrooms:any;
  stats:any[] = [];
  charts:any[] = [];

  async ngOnInit() {
    
    await this.getStats();
    await this.makeCharts();
  }
  
  // For each classroom of logged-in teacher, get average word count for each student (over all stories)
  private async getStats() {
    
    this.classrooms = await firstValueFrom(this.classroomService.getClassroomsForTeacher(this.auth.getUserDetails()._id));

    for (let entry in this.classrooms) {
      // only consider classrooms that have at least one student
      if (this.classrooms[entry].studentIds.length > 0) {
        // stats object created for each classroom
        let statsEntry = {
          classroomTitle: this.classrooms[entry].title,
          studentNames: [],
          averageWordCounts: [],
          chartId: "chartId_" + entry
        }
        
        // get student usernames and word count averages
        for (let key in this.classrooms[entry].studentIds) {
          const userId = this.classrooms[entry].studentIds[key];
          const usernameResponse = await firstValueFrom(this.userService.getUserById(userId));
          statsEntry.studentNames.push(usernameResponse.username);

          const wordCountResponse = await firstValueFrom(this.storyService.averageWordCount(userId));
          statsEntry.averageWordCounts.push(wordCountResponse.avgWordCount);
        }
          console.log(statsEntry);  
          this.stats.push(statsEntry);
      }
    }
  }
  
  private async makeCharts() {
    // wait for HTML to render before adding charts (need dynamically created ids)
    setTimeout(() => {
      for (let entry in this.stats) {
        let canvasElem = document.getElementById(this.stats[entry].chartId) as HTMLCanvasElement;
        let ctx = canvasElem.getContext('2d');
        let myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.stats[entry].studentNames,
                datasets: [{
                    label: 'Average Word Counts For ' + this.stats[entry].classroomTitle,
                    data: this.stats[entry].averageWordCounts,
                    backgroundColor: this.stats[entry].averageWordCounts.map(_ => LIGHT_RED),
                    borderColor: this.stats[entry].averageWordCounts.map(_ => RED),
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
    }, 1)
  }
  
}
