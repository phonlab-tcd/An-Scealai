import { Component, OnInit, TemplateRef } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { StoryService } from '../story.service';
import { AuthenticationService } from '../authentication.service';
import { ClassroomService } from '../classroom.service';
import { TranslationService } from '../translation.service';
import { UserService } from '../user.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ClassroomSelectorComponent } from './classroom-selector/classroom-selector.component';
import { Story } from 'app/story';
import { Classroom } from 'app/classroom';
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

  classroomStories: Story[] = [];
  studentStories: Story[]= [];
  classroomTitle = this.ts.l.select_a_classroom; // By default we'll display this
  textsToAnalyse: string[] = [];
  grammarErrorCounts: {[type: string]: number} = {};
  wordCountData: Object = {};
  dictionaryLookups: Object = {};
  grammarErrorTimeCounts: Object[] = [];
  userRole: string = '';
  dialogRef: MatDialogRef<unknown>;
  
  async ngOnInit() {
    // determine if user is a teacher or student
    this.userRole = this.auth.getUserDetails().role;

    if (this.userRole == 'TEACHER') {
      // initialise stats with classroom id from route param
      let classroom = await firstValueFrom(this.classroomService.getClassroom(this.route.snapshot.params['id']));
      if(classroom) await this.loadDataForChartsTeacher(classroom, '', ''); 
    }
    else {
      this.studentStories = await firstValueFrom(this.storyService.getStoriesByOwner(this.auth.getUserDetails()._id));
      await this.loadDataForChartsStudent(); 
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
    if (classroom) await this.loadDataForChartsTeacher(classroom, startDate, endDate);
  }
  
  /* Make calls to the backend to get stats data for teachers */
  async loadDataForChartsTeacher(classroom:Classroom, startDate:string, endDate:string) {
    this.classroomTitle = classroom.title;
    // get n-gram data
    this.classroomStories = (await Promise.all(classroom.studentIds.map(async (id) =>
      await firstValueFrom(this.storyService.getStoriesByDate(id, startDate, endDate))
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
    
    // // get word count data
    this.wordCountData = await this.getWordCounts(classroom, startDate, endDate);
    
    // get dictionary lookups 
    this.dictionaryLookups = {};
    await Promise.all(classroom.studentIds.map(async (id) =>
      this.dictionaryLookups[(await firstValueFrom(this.userService.getUserById(id))).username] =  
      await firstValueFrom(this.engagement.getDictionaryLookups(id, startDate, endDate))
    ));
    
    // get grammar error time data
    let totalGrammarCounts = [];
    await Promise.all(classroom.studentIds.map(async (id) => {
      let studentGrammarCounts = await firstValueFrom(this.http.get(`${config.baseurl}gramadoir/getUserGrammarCounts/${id}`))
      console.log(studentGrammarCounts);
      totalGrammarCounts.push(studentGrammarCounts);
     }
    ));
    this.grammarErrorTimeCounts = totalGrammarCounts;
    
  }
  
  /* Make calls to the backend to get stats data for students */
  async loadDataForChartsStudent() {
    let studentId = this.auth.getUserDetails()._id;
    // get n-gram data
    this.textsToAnalyse = this.studentStories.reduce(function(result, story) {
      if (story.text) result.push(story.text);
      return result;
    }, []);

    // get grammar eror data
    this.grammarErrorCounts = (await Promise.all(this.studentStories.map(async story =>
      await firstValueFrom(
        this.http.get(`${config.baseurl}gramadoir/getUniqueErrorTypeCounts/${story._id}`)
      )
    ))).reduce(this.countDictSum, {});
    
    // get word count data
    let data = {};
    data[this.auth.getUserDetails().username] = (await firstValueFrom(this.storyService.averageWordCount(studentId, '', ''))).avgWordCount;
    this.wordCountData = data;
    
    // get dictionary lookups 
    data = {};
    data[this.auth.getUserDetails()._id] = await firstValueFrom(this.engagement.getDictionaryLookups(studentId, '', ''));
    this.dictionaryLookups = data;
    
    // get grammar error time data
    let grammarErrors = [];
    grammarErrors[0] = await firstValueFrom(this.http.get(`${config.baseurl}gramadoir/getTimeGrammarCounts/${studentId}`));
    this.grammarErrorTimeCounts = grammarErrors;
    
  }

  countDictSum(A:any, B:any) {
    for (const key of Object.keys(B)) {
      A[key] = A[key] ? A[key] + B[key] : B[key] 
    }
    return A;
  }
  
  /*
  * Get average word count and username for each student in classroom (over all stories)
  */
  async getWordCounts(classroom:Classroom, startDate:string, endDate:string) {
    const data = {};
    await Promise.all(classroom.studentIds.map(async (id) =>
      data[(await firstValueFrom(this.userService.getUserById(id))).username] =  
      ((await firstValueFrom(this.storyService.averageWordCount(id, startDate, endDate))).avgWordCount)
    ));
    
    return data;
  }
  
  /*
  * Get grammar error counts for a given student ID
  */
  async countGrammarErrorsStudent(id:string) {
    // for now just get stats for the first student in the first classroom
    this.grammarErrorCounts = await firstValueFrom(this.storyService.countGrammarErrors(id));
  }
}
