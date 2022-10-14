import { Component, OnInit, TemplateRef } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { StoryService } from '../../story.service';
import { AuthenticationService } from '../../authentication.service';
import { ClassroomService } from '../../classroom.service';
import { UserService } from '../../user.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ClassroomSelectorComponent } from './classroom-selector/classroom-selector.component';
import { Classroom } from 'app/classroom'
import { Story } from 'app/story';
import { HttpClient } from '@angular/common/http';
import config from 'abairconfig';

@Component({
  selector: 'app-stats-dashboard',
  templateUrl: './stats-dashboard.component.html',
  styleUrls: ['./stats-dashboard.component.scss']
})
export class StatsDashboardComponent implements OnInit {

  constructor(
    private storyService: StoryService,
    private auth: AuthenticationService,
    private classroomService: ClassroomService,
    private userService: UserService,
    private dialog: MatDialog,
    private http: HttpClient,
  ) { }

  classrooms: Classroom[];
  classroomStories: Story[];
  classroomTitle = 'Select a classroom'; // By default we'll display this
  stats: any[] = [];
  dataLoaded: boolean = false;
  textsToAnalyse: string[] = [];
  grammarErrorCounts: {[type: string]: number} = {};

  async ngOnInit() {
    this.classrooms = await firstValueFrom(this.classroomService.getClassroomsForTeacher(this.auth.getUserDetails()._id));
    await this.getWordCounts();
        
    this.dataLoaded = true;
  }

  dialogRef: MatDialogRef<unknown>;

  openModal(templateRef: TemplateRef<unknown>) {
    this.dialogRef = this.dialog.open(templateRef, {
         width: '60%',
    });
    this.dialogRef.afterClosed().subscribe(_ => {
        this.dialogRef = undefined;
    });
  }

  async openClassroomSelector() {
    const classroomDialogRef = this.dialog.open(
      ClassroomSelectorComponent,
      { width: '60%' }
    );
    const classroom = await firstValueFrom(classroomDialogRef.afterClosed());
    this.classroomTitle = classroom.title;
    this.classroomStories = (await Promise.all(classroom.studentIds.map(async (id) =>
      await firstValueFrom(this.storyService.getStoriesByOwner(id))
    ))).flat();
    this.textsToAnalyse = this.classroomStories.map(story => story.text);

    this.grammarErrorCounts = (await Promise.all(this.classroomStories.map(async story =>
      await firstValueFrom(
        this.http.get(`${config.baseurl}gramadoir/getUniqueErrorTypeCounts/${story._id}`)
      )
    ))).reduce(this.countDictSum, {});
  }

  countDictSum(A, B) {
    for (const key of Object.keys(B)) {
      A[key] = A[key] ? A[key] + B[key] : B[key] 
    }
    return A;
  }
  
  /*
  * For each classroom of logged-in teacher, get average word count for each student (over all stories)
  */
  private async getWordCounts() {
    
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
  }
  
  /*
  * Get grammar error counts for a given student ID
  */
  private async countGrammarErrorsStudent(id:string) {
    // for now just get stats for the first student in the first classroom
    this.grammarErrorCounts = await firstValueFrom(this.storyService.countGrammarErrors(id));
  }
}
