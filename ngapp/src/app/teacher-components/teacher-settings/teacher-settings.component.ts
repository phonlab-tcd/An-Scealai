import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TranslationService } from '../../translation.service';
import { ClassroomService } from '../../classroom.service';
import { UserService } from '../../user.service';
import { Classroom } from '../../classroom';
import { User } from '../../user'
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
    broadSlender : true
  }
  changesSaved: boolean = true;


  async ngOnInit() {
    this.classroom = await firstValueFrom(this.classroomService.getClassroom(this.route.snapshot.params['id']));
    this.students = [];
    for(let id of this.classroom.studentIds) {
      this.userService.getUserById(id).subscribe((res : User) => {
        this.students.push(res);
        this.students.sort((a, b) => a.username.toLowerCase().localeCompare(b.username.toLowerCase()));
      });
    }
  }
  
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
  
  removeStudent(studentId:string) {
    this.dialogRef = this.dialog.open(BasicDialogComponent, {
      data: {
        title: 'Are you sure you want to remove this student from the class?',
        confirmText: this.ts.l.delete,
        cancelText: this.ts.l.cancel
      },
      width: '50%',
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
  
  async updateCheckers() {
    let checkers = [];
    for (const key in this.checkerSelection) {
      if(this.checkerSelection[key]) {
        checkers.push(key);
      }
    }
    await firstValueFrom(this.classroomService.updateClassroomCheckers(this.classroom._id, checkers));
    this.changesSaved = true;
  }

}
