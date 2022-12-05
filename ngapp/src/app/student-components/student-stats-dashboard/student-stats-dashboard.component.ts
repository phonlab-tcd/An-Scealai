import { Component, OnInit, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslationService } from '../../translation.service';
import { AuthenticationService } from '../../authentication.service';
import { EngagementService } from '../../engagement.service';
import { StoryService } from '../../story.service';
import { Story } from 'app/story';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import config from 'abairconfig';

@Component({
  selector: 'app-student-stats-dashboard',
  templateUrl: './student-stats-dashboard.component.html',
  styleUrls: ['./student-stats-dashboard.component.scss']
})
export class StudentStatsDashboardComponent implements OnInit {

  constructor(private ts: TranslationService,
              private auth: AuthenticationService,
              private storyService: StoryService,
              private http: HttpClient,
              private dialog: MatDialog,
              private engagement: EngagementService) { }
  
  dialogRef: MatDialogRef<unknown>;
  stories: Story[] = [];
  textsToAnalyse: string[] = [];
  grammarErrorCounts: {[type: string]: number} = {};
  wordCountData: Object = {};
  dictionaryWords: Object = {};

  async ngOnInit() {
    this.stories = await firstValueFrom(this.storyService.getStoriesByOwner(this.auth.getUserDetails()._id));
    await this.loadDataForCharts(); 
  }
  
  openModal(templateRef: TemplateRef<unknown>) {
    this.dialogRef = this.dialog.open(templateRef, {
         width: '90vh',
    });
    this.dialogRef.afterClosed().subscribe(_ => {
        this.dialogRef = undefined;
    });
  }
  
  async loadDataForCharts() {
    // get n-gram data
    this.textsToAnalyse = this.stories.reduce(function(result, story) {
      if (story.text) result.push(story.text);
      return result;
    }, []);

    // get grammar eror data
    this.grammarErrorCounts = (await Promise.all(this.stories.map(async story =>
      await firstValueFrom(
        this.http.get(`${config.baseurl}gramadoir/getUniqueErrorTypeCounts/${story._id}`)
      )
    ))).reduce(this.countDictSum, {});
    
    // get word count data
    let data = {};
    data[this.auth.getUserDetails().username] = (await firstValueFrom(this.storyService.averageWordCount(this.auth.getUserDetails()._id, '', ''))).avgWordCount;
    this.wordCountData = data;
    
    // get dictionary lookups 
    data = {};
    data[this.auth.getUserDetails()._id] = await firstValueFrom(this.engagement.getDictionaryLookups(this.auth.getUserDetails()._id, '', ''));
    this.dictionaryWords = data;
  }

  countDictSum(A, B) {
    for (const key of Object.keys(B)) {
      A[key] = A[key] ? A[key] + B[key] : B[key] 
    }
    return A;
  }
  
  /*
  * Get grammar error counts for a given student ID
  */
  async countGrammarErrorsStudent(id:string) {
    // for now just get stats for the first student in the first classroom
    this.grammarErrorCounts = await firstValueFrom(this.storyService.countGrammarErrors(id));
  }

}
