import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslationService } from '../../translation.service';
import { AuthenticationService } from '../../authentication.service';
import { Quiz } from '../chatbot.component';
import { BasicDialogComponent } from "../../dialogs/basic-dialog/basic-dialog.component";
import { ChatbotService } from "app/services/chatbot.service";
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-select-quiz-dialog',
  templateUrl: './select-quiz-dialog.component.html',
  styleUrls: ['./select-quiz-dialog.component.scss'],
})
export class SelectQuizDialogComponent implements OnInit {

  userQuizColumns: string[] = ['title', 'date', 'numOfQuestions', 'x'];
  classroomQuizColumns: string[] = ['title', 'date', 'numOfQuestions'];
  allQuizzes: Quiz[] = [];
  userQuizzes: Quiz[] = [];
  classroomQuizzes: Quiz[] = [];
  communityQuizzes: Quiz[] = [];
  dialogRef: MatDialogRef<unknown>;

  constructor(@Inject(MAT_DIALOG_DATA) 
    public data: any,
    public ts: TranslationService,
    public auth: AuthenticationService,
    private dialog: MatDialog,
    private chatbotService: ChatbotService,
    private dialogRefTest: MatDialogRef<SelectQuizDialogComponent>) {
      // get all quizzes from chatbot component
      this.allQuizzes = data.quizzes;
      // separate quizes into user quizes and classroom quizzes if student
      if (data.role == 'STUDENT') {
        const [pass, fail] = this.allQuizzes.reduce(([p, f], e) => (e.classroomId ? [[...p, e], f] : [p, [...f, e]]), [[], []]);
        this.classroomQuizzes = pass;
        this.userQuizzes = fail;
      }
      // assign all quizes as user quizes if teacher
      else {
        this.userQuizzes = this.allQuizzes;
      }
      
      console.log(this.classroomQuizzes);
      console.log(this.userQuizzes);

    }

  async ngOnInit() {
    this.communityQuizzes = await firstValueFrom(this.chatbotService.getCommunityQuizzes());
    console.log(this.communityQuizzes);
  }

  openDeleteQuizDialog(id: string) {
    this.dialogRef = this.dialog.open(BasicDialogComponent, {
      data: {
        title: this.ts.l.sure_you_want_to_delete_code,
        confirmText: this.ts.l.delete,
        cancelText: this.ts.l.cancel
      },
      width: '50%',
    });
    // delete quiz if user selects to do so
    this.dialogRef.afterClosed().subscribe( (res) => {
        this.dialogRef = undefined;
        console.log(res);
        if(res) {
          this.deleteQuiz(id)
        }
    });
  }

  deleteQuiz(id: string) {
    console.log("Delete should happen");

    this.chatbotService.deleteQuiz(id).subscribe({
      next: () => {
        // remove the deleted quiz from list of user quizzes (can't delete classroom quizes)
        this.userQuizzes = this.userQuizzes.filter(quiz => {
          return quiz._id !== id
        })
        this.allQuizzes = this.userQuizzes.concat(this.classroomQuizzes);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  openQuiz(selectedQuiz) {
    console.log(selectedQuiz);
    this.dialogRefTest.close({"selectedQuiz": selectedQuiz});
  }

  load(a, b, c) {
    console.log(a, b, c)
  }


}
