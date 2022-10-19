import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Story } from '../../story';
import { StoryService } from '../../story.service';
import { TranslationService } from '../../translation.service';
import { ClassroomService } from '../../classroom.service';
import config from 'abairconfig';
import { User } from 'app/user';

@Component({
  selector: 'app-teacher-student',
  templateUrl: './teacher-student.component.html',
  styleUrls: ['./teacher-student.component.scss']
})
export class TeacherStudentComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private http: HttpClient,
    private storyService: StoryService,
    private router: Router,
    public ts : TranslationService,
    private classroomService: ClassroomService) { }

    student: User;
    stories: Story[];
    storiesWithoutFeedback: Story[] = [];
    userId: string;
    classroomId: string;
    viewNoFeedback: boolean = false;

    baseUrl: string = config.baseurl;
  
    ngOnInit() {
      this.getUserId().then(params => {
        this.http.get(
          this.baseUrl + 'user/viewUser',
          { 
            headers: 
              {
              _id : params['id'].toString()
              }
          }
        ).subscribe(
        (res: User) => {
          this.userId = params['id'].toString();
          this.student = res;
          this.setClassroomId();
          
        });
      });
    }
    
    filterFeedback(data: Story[]) {
      for(let story of data) {
        if(story.feedback.text == null && story.feedback.audioId == null) {
          this.storiesWithoutFeedback.push(story);
        }
      }
    }
    
    setClassroomId(){
      this.classroomService.getClassroomOfStudent(this.userId).subscribe((res) => {
        this.classroomId = res._id;
        if(res.date) {
          this.storyService.getStoriesForClassroom(this.student._id, res.date).subscribe((data: Story[]) => {
            this.stories = data, this.filterFeedback(data);
          });
        }
        else {
          this.storyService.getStoriesFor(this.student.username).subscribe((data: Story[]) => {
            this.stories = data, this.filterFeedback(data);
          });
        }
      });
    }
  
    getUserId(): Promise<any> {
      return new Promise((resolve, reject) => {
        this.route.params.subscribe(
          params => {
            resolve(params);
        });
      });
    }
  
    goToStory(storyId) {
      this.router.navigateByUrl('teacher/story/' + storyId.toString());
    }

    goBack() {
      this.router.navigateByUrl('teacher/classroom/' + this.classroomId);
    }
}
