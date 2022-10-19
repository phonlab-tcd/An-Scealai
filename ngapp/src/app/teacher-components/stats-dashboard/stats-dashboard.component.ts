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
  textsToAnalyse: string[] = [];
  grammarErrorCounts: {[type: string]: number} = {};
  wordCountData: {studentNames, averageWordCounts} = {studentNames:[], averageWordCounts:[]};

  async ngOnInit() {
    this.classrooms = await firstValueFrom(this.classroomService.getClassroomsForTeacher(this.auth.getUserDetails()._id));
    if(this.classrooms.length > 0) await this.loadDataForCharts(this.classrooms[0]);
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
    if (classroom) await this.loadDataForCharts(classroom)
  }
  
  async loadDataForCharts(classroom) {
    this.classroomTitle = classroom.title;
    // get n-gram data
    this.classroomStories = (await Promise.all(classroom.studentIds.map(async (id) =>
      await firstValueFrom(this.storyService.getStoriesByOwner(id)) // Note: Most stories do not yet have the owner property
    ))).flat();
    this.textsToAnalyse = this.classroomStories.map(story => story.text);

    // get grammar eror data
    this.grammarErrorCounts = (await Promise.all(this.classroomStories.map(async story =>
      await firstValueFrom(
        this.http.get(`${config.baseurl}gramadoir/getUniqueErrorTypeCounts/${story._id}`)
      )
    ))).reduce(this.countDictSum, {});
    
    // get word count data
    this.wordCountData = await this.getWordCounts(classroom);
  }

  countDictSum(A, B) {
    for (const key of Object.keys(B)) {
      A[key] = A[key] ? A[key] + B[key] : B[key] 
    }
    return A;
  }
  
  /*
  * Get average word count and username for each student in classroom (over all stories)
  */
  async getWordCounts(classroom) {
    let statsEntry = {
      studentNames: [],
      averageWordCounts: []
    };
    
    await Promise.all(classroom.studentIds.map(async (id) => {
        statsEntry.studentNames.push((await firstValueFrom(this.userService.getUserById(id))).username);
        statsEntry.averageWordCounts.push((await firstValueFrom(this.storyService.averageWordCount(id))).avgWordCount);
      }
    ));
    
    return statsEntry;
  }
  
  /*
  * Get grammar error counts for a given student ID
  */
  async countGrammarErrorsStudent(id:string) {
    // for now just get stats for the first student in the first classroom
    this.grammarErrorCounts = await firstValueFrom(this.storyService.countGrammarErrors(id));
  }
}
