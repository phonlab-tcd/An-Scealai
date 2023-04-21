import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslationService } from '../../translation.service';
import { AuthenticationService } from '../../authentication.service';
import { Quiz } from '../chatbot.component';

@Component({
  selector: 'app-select-quiz-dialog',
  templateUrl: './select-quiz-dialog.component.html',
  styleUrls: ['./select-quiz-dialog.component.scss'],
})
export class SelectQuizDialogComponent implements OnInit {

  displayedColumns: string[] = ['title', 'date', 'numOfQuestions'];
  dataSource;
  userQuizzes: Quiz[] = [];
  classroomQuizzes: Quiz[] = [];
  communityQuizzes: Quiz[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) 
    public data: any,
    public ts: TranslationService,
    public auth: AuthenticationService) {
      console.log(data)
      if (data.role == 'STUDENT') {
        const [pass, fail] = data.quizzes.reduce(([p, f], e) => (e.classroomId ? [[...p, e], f] : [p, [...f, e]]), [[], []]);
        this.classroomQuizzes = pass;
        this.userQuizzes = fail;
      }
      else {
        this.userQuizzes = data.quizzes;
      }
      
      console.log(this.classroomQuizzes);
      console.log(this.userQuizzes);

    }

  ngOnInit(): void {
  }

}
