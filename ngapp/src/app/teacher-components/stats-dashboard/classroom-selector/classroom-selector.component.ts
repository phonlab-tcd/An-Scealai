import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ClassroomService } from '../../../classroom.service';
import { AuthenticationService } from 'app/authentication.service';
import { Classroom } from 'app/classroom';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-classroom-selector',
  templateUrl: './classroom-selector.component.html',
  styleUrls: ['./classroom-selector.component.scss']
})
export class ClassroomSelectorComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ClassroomSelectorComponent>,
    private classroomService: ClassroomService,
    private auth: AuthenticationService,
  ) { }

  classrooms: Classroom[];

  async ngOnInit() {
    const { _id } = this.auth.getUserDetails();
    this.classrooms = await firstValueFrom(
      this.classroomService.getClassroomsForTeacher(_id)
    );
  }

  closeDialog(classroom: Classroom | null) {
    this.dialogRef.close(classroom);
  }

}
