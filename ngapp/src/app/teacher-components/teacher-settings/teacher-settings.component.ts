import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TranslationService } from '../../translation.service';
import { ClassroomService } from '../../classroom.service';
import { UserService } from '../../user.service';
import { Classroom } from '../../core/models/classroom';
import { User } from '../../core/models/user'
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BasicDialogComponent } from '../../dialogs/basic-dialog/basic-dialog.component';

@Component({
  selector: 'app-teacher-settings',
  templateUrl: './teacher-settings.component.html',
  styleUrls: ['./teacher-settings.component.scss']
})
export class TeacherSettingsComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    public ts : TranslationService,
    private classroomService: ClassroomService,
    private dialog: MatDialog,
    private userService: UserService) { }
    
  classroom: Classroom;
  students: User[] = [];
  dialogRef: MatDialogRef<unknown>;
  checkerSelection = {
    anGramadoir : true,
    relativeClause : true,
    genitive : true,
    broadSlender : true,
    gaelSpell: true
  }
  changesSaved: boolean = true;

  /* Get classroom, list of students, and previous checker settings */
  async ngOnInit() {
    this.classroom = await firstValueFrom(this.classroomService.getClassroom(this.route.snapshot.params['id']));
    this.students = [];
    for(let id of this.classroom.studentIds) {
      this.userService.getUserById(id).subscribe({
        next: student => {
          this.students.push(student);
          this.students.sort((a, b) => a.username.toLowerCase().localeCompare(b.username.toLowerCase()));
        },
        error: () => console.log(id + " does not exist")
      });
    }
    
    let savedCheckers = await firstValueFrom(this.classroomService.getClassroomCheckers(this.classroom._id));
    
    // set checkboxes of checkers if teacher has previously selected certain ones
    if (savedCheckers.length > 0) {
      for (const key in this.checkerSelection) {
        savedCheckers.includes(key) ? this.checkerSelection[key] = true : this.checkerSelection[key] = false;
      }
    }

  }
  
  /* Open dialog for updating classroom title */
  openUpdateClassroomDialog() {    
    this.dialogRef = this.dialog.open(BasicDialogComponent, {
      data: {
        title: this.ts.l.edit_classroom_title,
        type: 'updateText',
        confirmText: this.ts.l.save,
        cancelText: this.ts.l.cancel
      },
      width: '50vh',
    });
    
    this.dialogRef.afterClosed().subscribe( (res) => {
        this.dialogRef = undefined;
        if(res) {
          let newTitle = res[0];
          this.classroomService.editTitle(this.classroom._id, newTitle).subscribe(() => {
            this.ngOnInit();
          }, (err) => {
            alert(err);
          });
        }
    });
  }
  
  /* Open dialog for grammar checker information (this content is not yet ready) */
  openInformationDialog() {    
    this.dialogRef = this.dialog.open(BasicDialogComponent, {
      data: {
        title: 'Grammar Checkers',
        type: 'simpleMessage',
        message: `
        <p><h5> An Gramadoir:</h5> ${this.ts.l.an_gramadoir_description}</p><br>
        <p><h5>${this.ts.l.relative_clause_checker}:</h5> ${this.ts.l.relative_clause_checker_description} </p><br>
        <p><h5>${this.ts.l.genitive_checker}:</h5> ${this.ts.l.genitive_checker_description} </p><br>
        <p><h5>${this.ts.l.broad_slender_checker}:</h5> ${this.ts.l.broad_slender_checker_description} </p><br>
        <p><h5> GaelSpell:</h5> ${this.ts.l.gael_spell_description} </p>
        `,
        confirmText: this.ts.l.done,
      },
      width: '80vh',
    });
    
    this.dialogRef.afterClosed().subscribe( (_) => {
        this.dialogRef = undefined;
    });
  }
  
  /* Remove student from classroom given student id */
  removeStudent(studentId:string) {
    this.dialogRef = this.dialog.open(BasicDialogComponent, {
      data: {
        title: this.ts.l.want_to_remove_student_from_class,
        confirmText: this.ts.l.delete,
        cancelText: this.ts.l.cancel
      },
      width: '50vh',
    });
    
    this.dialogRef.afterClosed().subscribe( (res) => {
        this.dialogRef = undefined;
        if(res) {
          this.classroomService.removeStudentFromClassroom(this.classroom._id, studentId).subscribe(() => {
              this.ngOnInit();
          });
        }
    });
  }
  
  /* Save grammar checker settings to the DB */
  async updateCheckers() {
    let checkers = [];
    for (const key in this.checkerSelection) {
      if(this.checkerSelection[key]) {
        checkers.push(key);
      }
    }
    await firstValueFrom(this.classroomService.setClassroomCheckers(this.classroom._id, checkers));
    this.changesSaved = true;
  }

}
