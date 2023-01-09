import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ClassroomService } from '../../classroom.service';
import { TranslationService } from '../../translation.service';
import { AuthenticationService } from 'app/authentication.service';
import { Classroom } from 'app/classroom';
import { firstValueFrom } from 'rxjs';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';

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
    public ts: TranslationService
  ) { }

  classrooms: Classroom[];
  
  // for selecting a date range
  range = new UntypedFormGroup({
    start: new UntypedFormControl(),
    end: new UntypedFormControl()
  });
  
  showDatePicker: boolean = false;


  async ngOnInit() {
    const { _id } = this.auth.getUserDetails();
    this.classrooms = await firstValueFrom(
      this.classroomService.getClassroomsForTeacher(_id)
    );
  }

  closeDialog(classroom: Classroom | null) {
    let startDate = (this.range.get("start").value) ? this.range.get("start").value : "";
    let endDate = (this.range.get("end").value) ? this.range.get("end").value : "";
    
    this.dialogRef.close({classroom:classroom, startDate: startDate, endDate: endDate});
  }

}
