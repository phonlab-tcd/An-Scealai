import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Story } from '../../story';
import { StoryService } from '../../story.service';
import { TranslationService } from '../../translation.service';
import { ClassroomService } from '../../classroom.service';

@Component({
  selector: 'app-teacher-student',
  templateUrl: './teacher-student.component.html',
  styleUrls: ['./teacher-student.component.css']
})
export class TeacherStudentComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private http: HttpClient,
    private storyService: StoryService,
    private router: Router,
    public ts : TranslationService,
    private classroomSerivce: ClassroomService) { }

    student: any;
    stories: Story[];
    userId: string;
    classroomId: string;
  
    ngOnInit() {
      this.getUserId().then(params => {
        this.http.get('http://localhost:4000/user/viewUser', {headers: {_id : params['id'].toString()}}).subscribe((res) => {
          this.userId = params['id'].toString();
          this.student = res;
          this.setClassroomId();
          this.storyService
          .getStoriesFor(this.student.username)
          .subscribe((data: Story[]) => {
            this.stories = data;
          });
        });
      })
    }

    setClassroomId() {
      this.classroomSerivce.getClassroomOfStudent(this.userId).subscribe((res) => {
        this.classroomId = res._id;
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
