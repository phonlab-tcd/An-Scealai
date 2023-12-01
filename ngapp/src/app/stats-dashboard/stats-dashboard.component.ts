import { Component, OnInit, TemplateRef } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { StoryService } from 'app/core/services/story.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ClassroomService } from 'app/core/services/classroom.service';
import { TranslationService } from 'app/core/services/translation.service';
import { UserService } from 'app/core/services/user.service';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ClassroomSelectorComponent } from './classroom-selector/classroom-selector.component';
import { Story } from 'app/core/models/story';
import { HttpClient } from '@angular/common/http';
import config from 'abairconfig';
import { ActivatedRoute } from '@angular/router';
import { EngagementService } from 'app/core/services/engagement.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { NgramDistributionModule } from 'app/story-stats/ngram-distribution/ngram-distribution.module';
import { WordCountsModule } from 'app/story-stats/word-counts/word-counts.module';
import { DictionaryLookupsModule } from 'app/story-stats/dictionary-lookups/dictionary-lookups.module';
import { GrammarPieChartModule } from 'app/story-stats/grammar-pie-chart/grammar-pie-chart.module';
import { GrammarErrorTimeModule } from 'app/story-stats/grammar-error-time/grammar-error-time.module';
import { SpinnerModule } from 'app/spinner/spinner.module';
import { MatButtonModule } from '@angular/material/button';


@Component({
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatDialogModule, SpinnerModule, NgramDistributionModule, WordCountsModule, DictionaryLookupsModule, GrammarPieChartModule, GrammarErrorTimeModule],
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
    private route: ActivatedRoute,
    private engagement: EngagementService,
    private auth: AuthenticationService
  ) {}

  stories: Story[] = [];
  classroomTitle = this.ts.l.select_a_classroom; // By default we'll display this
  textsToAnalyse: string[] = [];
  grammarErrorCounts: { [type: string]: number } = {};
  wordCountData: Object = {};
  dictionaryLookups: Object = {};
  grammarErrorTimeCounts: { startDate: Date | null; endDate: Date | null; data: Object[] } = {
    startDate: null,
    endDate: null,
    data: [],
  };
  userRole: string = "";
  dialogRef: MatDialogRef<unknown>;
  statsLoaded: boolean = false;

  async ngOnInit() {
    // determine if user is a teacher or student
    const user = this.auth.getUserDetails();
    if (!user) return;
    this.userRole = user.role;

    // get classroom students if teacher, otherwise get auth id for logged in student
    if (this.userRole == "TEACHER") {
      let classroom = await firstValueFrom(
        this.classroomService.getClassroom(this.route.snapshot.params["id"])
      );
      if (classroom) await this.loadDataForCharts(classroom.studentIds);
      this.classroomTitle = classroom.title;
    } else {
      await this.loadDataForCharts([user._id]);
    }
  }

  /* Open and close the dialog to make graphs full screen */
  openModal(templateRef: TemplateRef<unknown>) {
    this.dialogRef = this.dialog.open(templateRef, {
      width: "100vw",
    });
    this.dialogRef.afterClosed().subscribe((_) => {
      this.dialogRef = undefined;
    });
  }

  /* Open dialog to select which classroom teacher wants for stats */
  async openClassroomSelector() {
    const classroomDialogRef = this.dialog.open(ClassroomSelectorComponent, { width: "60%", });
    const classroomResponse = await firstValueFrom( classroomDialogRef.afterClosed() );
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
  async loadDataForCharts( studentIds: string[] = [], startDate: string = "", endDate: string = "" ) {
    this.statsLoaded = false;

    // get student stories
    this.stories = await this.getStudentStories(studentIds, startDate, endDate);
    if (!this.stories) return;

    // get n-gram data
    this.textsToAnalyse = await this.getNGramData();

    // get grammar eror data for pie chart
    this.grammarErrorCounts = await this.getGrammarErrorsPieChart();

    // get word count data
    this.wordCountData = await this.getWordCounts( studentIds, startDate, endDate );

    // get dictionary lookups
    this.dictionaryLookups = await this.getDictionaryLookups(studentIds, startDate, endDate);

    // get grammar error time data
    this.grammarErrorTimeCounts = await this.getGrammarErrorTimeSeries(studentIds, startDate, endDate );

    this.statsLoaded = true;
  }

  /**
   *
   * @param studentIds array of student ids
   * @param startDate start date limit for when stories created
   * @param endDate end date limit for when stories created
   * @returns list of stories from each student
   */
  async getStudentStories(studentIds: string[], startDate: string, endDate: string) {
    const stories = await Promise.all(
      studentIds.map(async (id) => {
        try {
          const stories = await firstValueFrom(this.storyService.getStoriesByDate(id, startDate, endDate));
          return stories;
        } catch (error) {
          console.error(`Error while fetching stories for student ${id}: ${error.message}`);
          return [];
        }
      })
    );
    return stories.flat();
  }

  /**
   * Calculate data for n-gram chart
   */
  async getNGramData() {
    let textArray = this.stories.reduce(function (result: string[], story: Story) {
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
    data = (
      await Promise.all(
        this.stories.map(async (story) => {
          try {
            const result = await firstValueFrom(
              this.http.get( `${config.baseurl}gramadoir/getUniqueErrorTypeCounts/${story._id}` )
            );
            return result;
          } catch (error) {
            console.error(`Pie Chart error for story ${story._id}: ${error.message}`);
            return {};
          }
        })
      )
    ).reduce(this.countDictSum, {});
    return data;
  }

  /**
   * Merge objects by key, if both objects have the same key then add values together
   * @param A object of grammar error names and counts
   * @param B object of grammar error names and counts
   * @returns merged object
   */
  countDictSum(A: any, B: any) {
    for (const key of Object.keys(B)) {
      A[key] = A[key] ? A[key] + B[key] : B[key];
    }
    return A;
  }

  /*
   * Get average word count and username for each student in classroom (over all stories)
   */
  async getWordCounts( studentIds: string[], startDate: string, endDate: string ) {
    const data = {};
    await Promise.all(
      studentIds.map(async (id) => {
        try {
          const student = await firstValueFrom(
            this.userService.getUserById(id)
          );
          if (student) {
            const wordCountData = (
              await firstValueFrom( this.storyService.averageWordCount(id, startDate, endDate) )
            ).avgWordCount;
            data[student.username] = wordCountData;
          }
        } catch (error) {
          console.error(`Word Count error for student ${id}: ${error.message}`);
        }
      })
    );
    return data;
  }

  /**
   * Get list of dictionary lookups for each student in classroom
   */
  async getDictionaryLookups( studentIds: string[], startDate: string, endDate: string ) {
    const data = {};
    await Promise.all(
      studentIds.map(async (id) => {
        try {
          const user = await firstValueFrom(this.userService.getUserById(id));
          const username = user.username;
          const dictionaryLookups = await firstValueFrom( this.engagement.getDictionaryLookups(id, startDate, endDate) );
          data[username] = dictionaryLookups;
        } catch (error) {
          // Handle the error here (e.g., logging, error handling)
          console.error(`Dictionary error for student ${id}: ${error.message}`);
        }
      })
    );
    console.log(data);
    return data;
  }

  /**
   * Get grammar error time data for each student in classroom
   */
  async getGrammarErrorTimeSeries(studentIds: string[], startDate: string, endDate: string) {
    let totalGrammarCounts: Object[] = [];
    const headers = { Authorization: "Bearer " + this.auth.getToken() };
    await Promise.all(
      studentIds.map(async (id) => {
        try {
          let studentGrammarCounts = await firstValueFrom(
            this.http.post(
              `${config.baseurl}gramadoir/getTimeGrammarCounts/${id}`,
              { startDate, endDate },
              { headers }
            )
          );
          totalGrammarCounts.push(studentGrammarCounts);
        } catch (error) {
          console.error(`Time series error for student ${id}: ${error.message}`);
        }
      })
    );
  
    return {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      data: totalGrammarCounts,
    };
  }
}
