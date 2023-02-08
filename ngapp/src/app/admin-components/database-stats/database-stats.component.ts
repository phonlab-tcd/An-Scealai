import { Component, OnInit } from "@angular/core";
import { firstValueFrom, Subject, Subscription } from "rxjs";
import { UserService } from "../../user.service";
import { StoryService } from "../../story.service";
import { Chart } from 'chart.js';
import { Story } from "app/story";

export interface StoryStats {
  totalStories: number,
  totalWords: number,
  avgWordCount: number,
  totalRecordings: number,
}

@Component({
  selector: "app-database-stats",
  templateUrl: "./database-stats.component.html",
  styleUrls: ["./database-stats.component.scss"],
})
export class DatabaseStatsComponent implements OnInit {
  userChart:any;
  storyStats: StoryStats
  dataLoaded: boolean = false;


  constructor(private userService: UserService, private storyService: StoryService) {}

  async ngOnInit() {
    await this.getUserCount();
    await this.getStoryStats();
    this.dataLoaded = true;
  }

  async getUserCount() {
    let userCounts = await firstValueFrom(this.userService.getUserCountAndStatus());
    console.log(userCounts)

    let canvasElem = document.getElementById(
      "user-counts"
    ) as HTMLCanvasElement;
    let ctx = canvasElem.getContext("2d");

    const labels = ["Students", "Teachers"];
    const data = {
      labels: labels,
      datasets: [          // one dataset for each user status: Active, Pending, Other
        {
          label: "Active",
          data: [userCounts.activeStudents, userCounts.activeTeachers],
          backgroundColor: "green",
        },
        {
          label: "Pending",
          data: [userCounts.pendingStudents, userCounts.pendingTeachers],
          backgroundColor: "yellow",
        },
        {
          label: "Other",
          data: [userCounts.totalStudents - (userCounts.activeStudents + userCounts.pendingStudents),
                 userCounts.totalTeachers - (userCounts.activeTeachers + userCounts.pendingTeachers)],
          backgroundColor: "red",
        },
      ],
    };

    this.userChart = new Chart(ctx, {
      type: "bar",
      data: data,
      options: {
        plugins: {
          title: {
            display: true,
            text: "Stacked bar chart",
          },
        },
        responsive: true,
      },
    });
  }

  async getStoryStats() {
    this.storyStats = await firstValueFrom<StoryStats>(this.storyService.getStoryStats());
    console.log(this.storyStats);
  }
}
