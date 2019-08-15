import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Story } from '../../story';
import { StoryService } from '../../story.service';
import { Classroom } from '../../classroom';
import { ClassroomService } from '../../classroom.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private http: HttpClient,
              private storyService: StoryService,
              private router: Router,
              private classroomService: ClassroomService) { }

  user: any;
  stories: Story[];
  classrooms: Classroom[];

  ngOnInit() {
    this.getUserId().then(params => {
      this.http.get('http://localhost:4000/user/viewUser', {headers: {_id : params['id'].toString()}}).subscribe((res) => {
        this.user = res;
        if(this.user.role === 'STUDENT') {
          this.getStories();
        } else if (this.user.role === 'TEACHER') {
          this.getClassrooms();
        }
      });
    })
  }

  getUserId(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.route.params.subscribe(
        params => {
          resolve(params);
      });
    });
  }

  getStories() {
    this.storyService
        .getStoriesFor(this.user.username)
        .subscribe((data: Story[]) => {
          this.stories = data;
        });
  }

  getClassrooms() {
    this.classroomService.getClassroomsForTeacher(this.user._id).subscribe((res : Classroom[]) => {
      this.classrooms = res;
    });
  }

  goToStory(storyId) {
    this.router.navigateByUrl('admin/story/' + storyId.toString());
  }

  goToClassroom(classroomId) {
    this.router.navigateByUrl('admin/classroom/' + classroomId);
  }
}
