import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TeacherRoutingModule } from './teacher-routing.module';
import { TeacherDashboardComponent } from './teacher-dashboard/teacher-dashboard.component';
import { TeacherStudentComponent } from './teacher-student/teacher-student.component';
import { TeacherClassroomComponent } from './teacher-classroom/teacher-classroom.component';
import { TeacherSettingsComponent } from './teacher-settings/teacher-settings.component';
import { TeacherDictoglossComponent } from './teacher-dictogloss/teacher-dictogloss.component';
import { ClassroomDrawerComponent } from './classroom-drawer/classroom-drawer.component';
import { StudentListComponent } from './student-list/student-list.component';

import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { FeedbackModule } from '../feedback/feedback.module';

@NgModule({
  declarations: [
    TeacherDashboardComponent,
    TeacherStudentComponent,
    TeacherClassroomComponent,
    TeacherSettingsComponent,
    TeacherDictoglossComponent,
    ClassroomDrawerComponent,
    StudentListComponent,
  ],
  imports: [
    CommonModule,
    TeacherRoutingModule,
    FormsModule,
    MatCardModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatExpansionModule,
    MatDividerModule,
    ReactiveFormsModule,
    FeedbackModule,
  ]
})
export class TeacherModule { }
