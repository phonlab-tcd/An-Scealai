import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { StoryService } from '../../story.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { TranslationService } from '../../translation.service';
import { UserService } from '../../user.service';
import { ProfileService } from '../../profile.service';
import { AuthenticationService } from '../../authentication.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RecordingDialogComponent } from '../../dialogs/recording-dialog/recording-dialog.component';
import config from 'abairconfig';

@Component({
  selector: 'app-teacher-story',
  templateUrl: './teacher-story.component.html',
  styleUrls: ['./teacher-story.component.scss']
})
export class TeacherStoryComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private http: HttpClient,
    private storyService: StoryService,
    protected sanitizer: DomSanitizer,
    public ts : TranslationService,
    private router: Router,
    private userService: UserService,
    private profileService: ProfileService,
    private auth: AuthenticationService,
    private dialog: MatDialog,) { }

  story : any;
  audioSource : SafeUrl;
  feedbackText: string;
  authorPossessive : string;
  feedbackSent : boolean = false;
  userId: string;
  isFromAmerica: boolean = false;
  dialogRef: MatDialogRef<unknown>;
  baseUrl: string = config.baseurl;

  ngOnInit() {
    this.getStoryData();
    const userDetails = this.auth.getUserDetails();
    if (!userDetails) return;

    //set date format
    this.profileService.getForUser(userDetails._id).subscribe((res) => {
      let p = res.profile;
      let country = p.country;
      if(country == "United States of America" || country == "America" || country == "USA" || country == "United States") {
        this.isFromAmerica = true;
      }
      else {
        this.isFromAmerica = false;
      }
    });
  }

/*
* Use url parameters to get the story and its audio feedback, the author's name 
* with possessive ending, and the user's id 
*/
  getStoryData() {
    this.http.get(this.baseUrl + 'story/viewStory/' + this.route.snapshot.params['id']).subscribe((res) => {
      this.story = res[0];
      if(this.story.htmlText == null) {
        this.story.htmlText = this.story.text;
      }
      this.getFeedbackAudio();
      this.getAuthorPossessive();
      this.getUserId();
    });
  }

/*
* Add the possessive 's' ending to the author's name
*/
  getAuthorPossessive() {
    let name : string = this.story.author;
    this.authorPossessive = name + '\'' + (name[name.length - 1] === 's' ? '' : 's');
  }

/*
* Get the id of the author using the user service 
* Set date format dependng on where the user is from using the profile service
*/
  getUserId() {
    this.userService.getUserByUsername(this.story.author).subscribe((res) => {
      this.userId = res[0]._id;
    })
  }

/*
* get audio feedback from the database using the story service 
*/
  getFeedbackAudio() {
    this.storyService.getFeedbackAudio(this.story._id).subscribe((res) => {
      if(res.type == "audio/mp3") {
        this.audioSource = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(res));
      }
    });
  }

/*
* Add feedback text to the story using the story service 
*/
  sendFeedback() {
    this.storyService.addFeedback(this.story._id, this.story.feedback.text).subscribe((res) => {
      this.feedbackSent = true;
    });
  }
  
  /* 
  * Open Recording Dialog Box 
  */
  openRecordingDialog() {
    this.dialogRef = this.dialog.open(RecordingDialogComponent, {
      data: {
        type: 'feedbackAudio',
        id: this.story._id,
        confirmButton: this.ts.l.save
      },
      width: '30vh',
    });
    
    this.dialogRef.afterClosed().subscribe( (res) => {
        this.dialogRef = undefined;
        if(res) {
          this.getFeedbackAudio();
        }
    });
  }

  goBack() {
    this.router.navigateByUrl('teacher/student/' + this.userId);
  }
}
