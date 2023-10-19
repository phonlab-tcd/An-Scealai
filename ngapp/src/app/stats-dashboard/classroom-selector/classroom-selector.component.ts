import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ClassroomService } from 'app/core/services/classroom.service';
import { TranslationService } from 'app/core/services/translation.service';
import { UserService } from '../../core/services/user.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Classroom } from 'app/core/models/classroom';
import { firstValueFrom } from 'rxjs';
import { UntypedFormGroup, UntypedFormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatDatepickerModule, MatSelectModule],
  selector: 'app-classroom-selector',
  templateUrl: './classroom-selector.component.html',
  styleUrls: ['./classroom-selector.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ClassroomSelectorComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ClassroomSelectorComponent>,
    private classroomService: ClassroomService,
    private auth: AuthenticationService,
    public ts: TranslationService,
    public userService: UserService
  ) { }

  classrooms: Classroom[] = [];
  selectedStudents: string[] = [];
  studentUsernames: Object = {};
  
  // for selecting a date range
  range = new UntypedFormGroup({
    start: new UntypedFormControl(),
    end: new UntypedFormControl()
  });
  
  showDatePicker: boolean = false;

  async ngOnInit() {
    const { _id } = this.auth.getUserDetails();
    const allClassrooms = await firstValueFrom( this.classroomService.getClassroomsForTeacher(_id) );
    // only display classrooms that have students
    this.classrooms = allClassrooms.filter(classroom => classroom.studentIds.length > 0);

    // create dictionary for student ids -> usernames
    this.classrooms.forEach( (classroom) => {
      classroom.studentIds.forEach( async (id) => {
        let username = (await firstValueFrom(this.userService.getUserById(id))).username;
        this.studentUsernames[id] = username;
      })
    })
  }

  closeDialog(classroom: Classroom | null, studentIds) {
    let startDate = (this.range.get("start").value) ? this.range.get("start").value : "";
    let endDate = (this.range.get("end").value) ? this.range.get("end").value : "";

    // filter student id array if selected student
    if (studentIds) {
      classroom.studentIds = studentIds.split(',');
    }
    
    this.dialogRef.close({classroom:classroom, startDate: startDate, endDate: endDate});
  }

}
