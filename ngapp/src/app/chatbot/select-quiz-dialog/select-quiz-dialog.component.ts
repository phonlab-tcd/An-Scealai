import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, } from "@angular/material/dialog";
import { TranslationService } from "../../translation.service";
import { AuthenticationService } from "../../authentication.service";
import { Quiz } from "../chatbot.component";
import { BasicDialogComponent } from "../../dialogs/basic-dialog/basic-dialog.component";
import { ChatbotService } from "app/services/chatbot.service";
import { firstValueFrom } from "rxjs";

@Component({
  selector: "app-select-quiz-dialog",
  templateUrl: "./select-quiz-dialog.component.html",
  styleUrls: ["./select-quiz-dialog.component.scss"],
})
export class SelectQuizDialogComponent implements OnInit {
  userQuizColumns: string[] = ["title", "date", "numOfQuestions", "x"];
  classroomQuizColumns: string[] = ["title", "date", "numOfQuestions"];
  allQuizzes: Quiz[] = [];
  userQuizzes: Quiz[] = [];
  classroomQuizzes: Quiz[] = [];
  communityQuizzes: Quiz[] = [];
  dialogRef: MatDialogRef<unknown>;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    public ts: TranslationService,
    public auth: AuthenticationService,
    private dialog: MatDialog,
    private chatbotService: ChatbotService,
    private dialogRefTest: MatDialogRef<SelectQuizDialogComponent>
  ) {
    // get all quizzes from chatbot component
    this.allQuizzes = data.quizzes;
    // separates quizes into user quizes and classroom quizzes if user is a student
    if (data.role == "STUDENT") {
      // checks if each quiz item has a classroom id and puts it in the appropriate array
      const [yesId, noId] = this.allQuizzes.reduce(
        ([y, n], quiz) => (quiz.classroomId ? [[...y, quiz], n] : [y, [...n, quiz]]),
        [[], []]
      );
      this.classroomQuizzes = yesId;
      this.userQuizzes = noId;
    }
    // assigns all quizes as user quizes if user is a teacher
    else {
      this.userQuizzes = this.allQuizzes;
    }
  }

  /**
   * Load in community quizzes
   */
  async ngOnInit() {
    this.communityQuizzes = await firstValueFrom( this.chatbotService.getCommunityQuizzes() );
  }

  /**
   * Open dialog for deleting a selected quiz
   * @param id Quiz id
   */
  openDeleteQuizDialog(quizId: string) {
    this.dialogRef = this.dialog.open(BasicDialogComponent, {
      data: {
        title: this.ts.l.sure_you_want_to_delete_code,
        confirmText: this.ts.l.delete,
        cancelText: this.ts.l.cancel,
      },
      width: "50%",
    });
    // delete quiz if user selects to do so
    this.dialogRef.afterClosed().subscribe((res) => {
      this.dialogRef = undefined;
      if (res) {
        this.deleteQuiz(quizId);
      }
    });
  }

  /**
   * Delete quiz from the DB and remove it from the current list of quizzes
   * @param id Quiz id
   */
  deleteQuiz(id: string) {
    this.chatbotService.deleteQuiz(id).subscribe({
      next: () => {
        // remove the deleted quiz from list of user quizzes (can't delete classroom quizes)
        this.userQuizzes = this.userQuizzes.filter((quiz) => {
          return quiz._id !== id;
        });
        this.allQuizzes = this.userQuizzes.concat(this.classroomQuizzes);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  /**
   * Send the selected quiz back to the bot component in order to load it
   * @param selectedQuiz quiz to load
   */
  openQuiz(selectedQuiz: Quiz) {
    this.dialogRefTest.close({ selectedQuiz: selectedQuiz });
  }
}
