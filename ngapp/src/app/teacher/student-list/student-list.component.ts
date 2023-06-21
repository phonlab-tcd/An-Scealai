import { Component, OnInit, Input } from '@angular/core';
import { Classroom } from "../../core/models/classroom";
import { User } from '../../core/models/user';
import { UserService } from '../../core/services/user.service';
import { StoryService } from 'app/core/services/story.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit {

  @Input() classroom: Classroom;
  students : User[] = [];
  numOfStories: Map<string, number> = new Map();
  studentStories: Object = {};

  constructor(private userService: UserService, private storyService : StoryService,) { }

  ngOnInit(): void {
  }

  ngOnChanges(_) {
    this.getStudents();
  }

  /*
  * Loop through student ids in classroom object to get student objects
  */
  async getStudents() {
    this.students = [];
    for(let id of this.classroom.studentIds) {
      this.userService.getUserById(id).subscribe({
        next: async student => {
          this.students.push(student);          
          let stories = await firstValueFrom(this.storyService.getStoriesForClassroom(student._id, this.classroom.date?.toString()));
          if (stories) {
            this.numOfStories.set(student.username, stories.length);
            this.studentStories[student.username] = stories;
          }
          else {
            this.numOfStories.set(student.username, 0);
            this.studentStories[student.username] = [];
          }
        },
        error: () => {console.log(id + " does not exist")}
      });
    }
  }

}
