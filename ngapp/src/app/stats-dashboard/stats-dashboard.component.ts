import { Component, OnInit, TemplateRef } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { StoryService } from '../story.service';
import { AuthenticationService } from '../authentication.service';
import { ClassroomService } from '../classroom.service';
import { TranslationService } from '../translation.service';
import { UserService } from '../user.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ClassroomSelectorComponent } from './classroom-selector/classroom-selector.component';
import { Story } from 'app/core/models/story';
import { HttpClient } from '@angular/common/http';
import config from 'abairconfig';
import { ActivatedRoute } from '@angular/router';
import { EngagementService } from '../engagement.service';

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
    private engagement:EngagementService,
    private auth: AuthenticationService,
  ) { }

  stories: Story[] = [];
  classroomTitle = this.ts.l.select_a_classroom; // By default we'll display this
  textsToAnalyse: string[] = [];
  grammarErrorCounts: {[type: string]: number} = {};
  wordCountData: Object = {};
  dictionaryLookups: Object = {};
  grammarErrorTimeCounts: {startDate: Date, endDate: Date, data: Object[]} = {startDate: null, endDate: null, data: []};
  userRole: string = '';
  dialogRef: MatDialogRef<unknown>;
  
  async ngOnInit() {
    // determine if user is a teacher or student
    this.userRole = this.auth.getUserDetails().role;

    // get classroom students if teacher, otherwise get auth id for logged in student
    if (this.userRole == 'TEACHER') {
      let classroom = await firstValueFrom(this.classroomService.getClassroom(this.route.snapshot.params['id']));
      if(classroom) await this.loadDataForCharts(classroom.studentIds); 
      this.classroomTitle = classroom.title;
    }
    else {
      await this.loadDataForCharts([this.auth.getUserDetails()._id]); 
    }
  }

  /* Open and close the dialog to make graphs full screen */
  openModal(templateRef: TemplateRef<unknown>) {
    this.dialogRef = this.dialog.open(templateRef, {
         width: '100vw',
    });
    this.dialogRef.afterClosed().subscribe(_ => {
        this.dialogRef = undefined;
    });
  }

  /* Open dialog to select which classroom teacher wants for stats */
  async openClassroomSelector() {
    const classroomDialogRef = this.dialog.open(
      ClassroomSelectorComponent,
      { width: '60%' }
    );
    const classroomResponse = await firstValueFrom(classroomDialogRef.afterClosed());
    const classroom = classroomResponse.classroom;
    const startDate = classroomResponse.startDate;
    const endDate = classroomResponse.endDate;
    if (classroom) {
      await this.loadDataForCharts(classroom.studentIds, startDate, endDate);
      this.classroomTitle = classroom.title;
    }
  }
  
  /**
   * Make calls to the backend to get stats data for teachers
   * @param studentIds array of student ids (only one id if user is student)
   * @param startDate start date if teacher selects date range
   * @param endDate end date if teacher selects date range
   */
  async loadDataForCharts(studentIds:string[] = [], startDate:string = '', endDate:string = '') {
    // get n-gram data
    this.textsToAnalyse = await this.getNGramData(studentIds, startDate, endDate);

    // get grammar eror data for pie chart
    this.grammarErrorCounts = await this.getGrammarErrorsPieChart();
    
    // get word count data
    this.wordCountData = await this.getWordCounts(studentIds, startDate, endDate);
    
    // get dictionary lookups 
    this.dictionaryLookups = await this.getDictionaryLookups(studentIds, startDate, endDate);
    
    // get grammar error time data
    this.grammarErrorTimeCounts = await this.getGrammarErrorTimeSeries(studentIds, startDate, endDate);
  }

  /**
   * Get stories for students and calculate data for n-gram chart
   */
  async getNGramData(studentIds:string[], startDate:string, endDate:string) {
    this.stories = (await Promise.all(studentIds.map(async (id) =>
      await firstValueFrom(this.storyService.getStoriesByDate(id, startDate, endDate))
    ))).flat();
    
    let textArray = this.stories.reduce(function(result, story) {
      if (story.text) result.push(story.text);
      return result;
    }, []);
    return textArray;
  }

  /**
   * Get grammar error counts for all stories pie chart
   */
  async getGrammarErrorsPieChart() {
    let data = {};
    data = (await Promise.all(this.stories.map(async story =>
      await firstValueFrom(
        this.http.get(`${config.baseurl}gramadoir/getUniqueErrorTypeCounts/${story._id}`)
      )
    ))).reduce(this.countDictSum, {});
    return data;
  }

  /**
   * Merge objects by key, if both objects have the same key then add values together
   * @param A object of grammar error names and counts
   * @param B object of grammar error names and counts
   * @returns merged object
   */
    countDictSum(A:any, B:any) {
      for (const key of Object.keys(B)) {
        A[key] = A[key] ? A[key] + B[key] : B[key] 
      }
      return A;
    }
  
  /*
  * Get average word count and username for each student in classroom (over all stories)
  */
  async getWordCounts(studentIds:string[], startDate:string, endDate:string) {
    const data = {};
    await Promise.all(studentIds.map(async (id) =>
      data[(await firstValueFrom(this.userService.getUserById(id))).username] =  
      ((await firstValueFrom(this.storyService.averageWordCount(id, startDate, endDate))).avgWordCount)
    ));
    return data;
  }

  /**
   * Get list of dictionary lookups for each student in classroom
   */
  async getDictionaryLookups(studentIds:string[], startDate:string, endDate:string) {
    const data = {};
    await Promise.all(studentIds.map(async (id) =>
      data[(await firstValueFrom(this.userService.getUserById(id))).username] =  
      await firstValueFrom(this.engagement.getDictionaryLookups(id, startDate, endDate))
    ));
    return data;
  }

  /**
   * Get grammar error time data for each student in classroom
   */
  async getGrammarErrorTimeSeries(studentIds:string[], startDate:string, endDate:string) {
    let totalGrammarCounts = [];
    const headers = { 'Authorization': 'Bearer ' + this.auth.getToken() }
    await Promise.all(studentIds.map(async (id) => {
      let studentGrammarCounts = await firstValueFrom(this.http.post(`${config.baseurl}gramadoir/getTimeGrammarCounts/${id}`, {startDate, endDate}, {headers}))
      totalGrammarCounts.push(studentGrammarCounts);
     }
    ));

    return {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      data: totalGrammarCounts
    }
  }
  
}
