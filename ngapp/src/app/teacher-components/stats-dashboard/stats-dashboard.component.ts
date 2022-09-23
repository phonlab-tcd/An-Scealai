import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { StoryService } from '../../story.service';
import { AuthenticationService } from '../../authentication.service';
import { ClassroomService } from '../../classroom.service';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-stats-dashboard',
  templateUrl: './stats-dashboard.component.html',
  styleUrls: ['./stats-dashboard.component.scss']
})
export class StatsDashboardComponent implements OnInit {

  constructor(private storyService: StoryService, private auth: AuthenticationService,
  private classroomService: ClassroomService, private userService: UserService) { }
  
  classrooms:any;
  stats:any[] = [];
  dataLoaded:boolean = false;

  ngOnInit(): void {
    this.getWordCounts();
  }
  

  toggleFullscreen(event: MouseEvent): void {
    // Make the card fullscreen via CSS
    const targetElem = event.target as HTMLElement;
    const cardElem = targetElem.closest('.stats-card') as HTMLElement; // They may have clicked on a descendent of the mat card
    const canvasElem = cardElem.querySelector('canvas');
    if (cardElem.classList.contains('stats-card-fullscreen')) {
      cardElem.classList.remove('stats-card-fullscreen');
      canvasElem.style.cssText = `width: 400px; height: 200px;`;
    } else {
      cardElem.classList.add('stats-card-fullscreen');
      canvasElem.width = cardElem.offsetWidth;
      canvasElem.height = 400;
      canvasElem.style.cssText = `width: ${cardElem.offsetWidth}px;`;
    }
  }
  
  
  // For each classroom of logged-in teacher, get average word count for each student (over all stories)
  private async getWordCounts() {
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
          this.stats.push(statsEntry);
      }
    }
    if (this.stats.length > 0) 
      this.dataLoaded = true;
  }

}
