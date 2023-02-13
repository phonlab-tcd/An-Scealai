import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Story } from '../../story';
import { Classroom } from '../../classroom';
import { firstValueFrom } from 'rxjs'
import { StoryService } from '../../story.service';
import { UserService } from '../../user.service';
import { TranslationService } from '../../translation.service';
import { ClassroomService } from '../../classroom.service';
import { User } from 'app/user';

@Component({
  selector: 'app-teacher-student',
  templateUrl: './teacher-student.component.html',
  styleUrls: ['./teacher-student.component.scss']
})
export class TeacherStudentComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private storyService: StoryService,
    private userService: UserService,
    private router: Router,
    public ts : TranslationService,
    private classroomService: ClassroomService) { }

    student: User;
    stories: Story[];
    storiesWithoutFeedback: Story[] = [];
    classroom: Classroom;
    viewNoFeedback: boolean = false;
  
    /* get student stories and filter by feedback given */
    async ngOnInit() {
      this.student = await firstValueFrom(this.userService.getUserById(this.route.snapshot.params['id']));
      this.classroom = await firstValueFrom(this.classroomService.getClassroomOfStudent(this.student._id));
      // only get stories written after classroom creation date (or get all if no date)
      this.stories = await firstValueFrom(this.storyService.getStoriesForClassroom(this.student._id, this.classroom.date?.toString()));
      this.stories.sort((a,b) => (a.lastUpdated > b.lastUpdated) ? -1 : ((b.lastUpdated > a.lastUpdated) ? 1 : 0))


      // filter stories for those that have no feedback
      this.storiesWithoutFeedback = this.stories.filter( (story) => {
        return (story.feedback.text === null && story.feedback.audioId === null)
      })
    }

    goToStory(storyId) {
      this.router.navigateByUrl('teacher/story/' + storyId.toString());
    }

    goBack() {
      this.router.navigateByUrl('teacher/classroom/' + this.classroom._id);
    }
}
