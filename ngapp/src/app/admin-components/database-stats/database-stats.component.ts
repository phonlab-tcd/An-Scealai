import { Component, OnInit } from "@angular/core";
import { firstValueFrom, Subject, Subscription } from "rxjs";
import { UserService } from "../../user.service";
import { StoryService } from "../../story.service";
import { ClassroomService } from "../../classroom.service";
import { ProfileService } from "../../profile.service";
import { Chart } from 'chart.js';

export interface StoryStats {
  totalStories: number,
  totalWords: number,
  avgWordCount: number,
  totalRecordings: number,
  totalFeedback: number,
  onlyTextFeedback: number,
  onlyAudioFeedback: number,
  bothAudioAndText: number,
  totalFeedbackWords: number,
  avgFeedbackWordCount: number,
}

@Component({
  selector: "app-database-stats",
  templateUrl: "./database-stats.component.html",
  styleUrls: ["./database-stats.component.scss"],
})
export class DatabaseStatsComponent implements OnInit {
  userChart:any;
  userCounts:any;
  storyStats: StoryStats
  totalClassrooms: number = 0;
  profileFilledPercentage: number = 0;
  studentsWithStoriesPercentage: number = 0;
  teachersWithClassroomsPercentage: number = 0;
  englishPercentage: number = 0;
  irishPercentage: number = 0;
  dataLoaded: boolean = false;

  constructor(private userService: UserService, private storyService: StoryService,
              private classroomService: ClassroomService, private profileService: ProfileService) {}

  async ngOnInit() {
    await this.getUserCount();
    await this.getStoryStats();
    this.totalClassrooms = await firstValueFrom(this.classroomService.getTotalClassrooms());
    let numProfiles = await firstValueFrom(this.profileService.getNumOfProfiles());
    this.profileFilledPercentage = numProfiles / this.userCounts.total;
    let studentsWithStories = await firstValueFrom(this.userService.countUsersWithStories());
    this.studentsWithStoriesPercentage = studentsWithStories / this.userCounts.totalStudents;
    let teachersWithClassrooms = await firstValueFrom(this.userService.countTeachersWithClassrooms());
    this.teachersWithClassroomsPercentage = teachersWithClassrooms / this.userCounts.totalTeachers;
    let languageCounts = await firstValueFrom(this.userService.getLanguageCount());
    console.log(languageCounts);
    this.englishPercentage = languageCounts.englishCount / this.userCounts.total;
    this.irishPercentage = languageCounts.irishCount / this.userCounts.total;
    this.dataLoaded = true;
  }

  async getUserCount() {
    this.userCounts = await firstValueFrom(this.userService.getUserCountAndStatus());
    console.log(this.userCounts)

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
          data: [this.userCounts.activeStudents, this.userCounts.activeTeachers],
          backgroundColor: "green",
        },
        {
          label: "Pending",
          data: [this.userCounts.pendingStudents, this.userCounts.pendingTeachers],
          backgroundColor: "yellow",
        },
        {
          label: "Not specified",
          data: [this.userCounts.totalStudents - (this.userCounts.activeStudents + this.userCounts.pendingStudents),
                 this.userCounts.totalTeachers - (this.userCounts.activeTeachers + this.userCounts.pendingTeachers)],
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
        // maintainAspectRatio: false
      },
    });
  }

  async getStoryStats() {
    this.storyStats = await firstValueFrom<StoryStats>(this.storyService.getStoryStats());
    console.log(this.storyStats);
  }
}
