import { Component, OnInit, TemplateRef } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { StoryService } from '../../story.service';
import { ClassroomService } from '../../classroom.service';
import { TranslationService } from '../../translation.service';
import { UserService } from '../../user.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ClassroomSelectorComponent } from './classroom-selector/classroom-selector.component';
import { Story } from 'app/story';
import { HttpClient } from '@angular/common/http';
import config from 'abairconfig';
import { ActivatedRoute } from '@angular/router';
import { EngagementService } from '../../engagement.service';

@Component({
  selector: 'app-stats-dashboard',
  templateUrl: './stats-dashboard.component.html',
  styleUrls: ['./stats-dashboard.component.scss']
})
export class StatsDashboardComponent implements OnInit {

  constructor(
    private storyService: StoryService,
    private classroomService: ClassroomService,
    private userService: UserService,
    private dialog: MatDialog,
    private http: HttpClient,
    private ts: TranslationService,
    private route:ActivatedRoute,
    private engagement:EngagementService
  ) { }

  classroomStories: Story[];
  classroomTitle = 'Select a classroom'; // By default we'll display this
  textsToAnalyse: string[] = [];
  grammarErrorCounts: {[type: string]: number} = {};
  wordCountData: {studentNames, averageWordCounts} = {studentNames:[], averageWordCounts:[]};
  dictionaryLookups: Object = {};
  
  async ngOnInit() {
    // initialise stats with classroom id from route param
    let classroom = await firstValueFrom(this.classroomService.getClassroom(this.route.snapshot.params['id']));
    if(classroom) await this.loadDataForCharts(classroom, '', ''); 
  }

  dialogRef: MatDialogRef<unknown>;

  openModal(templateRef: TemplateRef<unknown>) {
    this.dialogRef = this.dialog.open(templateRef, {
         width: '60vh',
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
    const classroomResponse = await firstValueFrom(classroomDialogRef.afterClosed());
    const classroom = classroomResponse.classroom;
    const startDate = classroomResponse.startDate;
    const endDate = classroomResponse.endDate;
    if (classroom) await this.loadDataForCharts(classroom, startDate, endDate);
  }
  
  async loadDataForCharts(classroom, startDate, endDate) {
    this.classroomTitle = classroom.title;
    // get n-gram data
    this.classroomStories = (await Promise.all(classroom.studentIds.map(async (id) =>
      await firstValueFrom(this.storyService.getStoriesByDate(id, startDate, endDate)) // Note: Most stories do not yet have the owner property
    ))).flat();
    
    this.textsToAnalyse = this.classroomStories.reduce(function(result, story) {
      if (story.text) result.push(story.text);
      return result;
    }, []);

    // get grammar eror data
    this.grammarErrorCounts = (await Promise.all(this.classroomStories.map(async story =>
      await firstValueFrom(
        this.http.get(`${config.baseurl}gramadoir/getUniqueErrorTypeCounts/${story._id}`)
      )
    ))).reduce(this.countDictSum, {});
    
    // get word count data
    this.wordCountData = await this.getWordCounts(classroom, startDate, endDate);
    
    // get dictionary lookups 
    this.dictionaryLookups = {};
    await Promise.all(classroom.studentIds.map(async (id) =>
      this.dictionaryLookups[(await firstValueFrom(this.userService.getUserById(id))).username] =  
      await firstValueFrom(this.engagement.getDictionaryLookups(id, startDate, endDate))
    ));
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
  async getWordCounts(classroom, startDate, endDate) {
    let statsEntry = {
      studentNames: [],
      averageWordCounts: []
    };
    
    await Promise.all(classroom.studentIds.map(async (id) => {
        statsEntry.studentNames.push((await firstValueFrom(this.userService.getUserById(id))).username);
        statsEntry.averageWordCounts.push((await firstValueFrom(this.storyService.averageWordCount(id, startDate, endDate))).avgWordCount);
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
