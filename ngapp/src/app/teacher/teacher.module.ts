import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TeacherRoutingModule } from './teacher-routing.module';

import { TeacherDashboardComponent } from './teacher-dashboard/teacher-dashboard.component';
import { TeacherStudentComponent } from './teacher-student/teacher-student.component';
import { TeacherClassroomComponent } from './teacher-classroom/teacher-classroom.component';
import { TeacherStoryComponent } from './teacher-story/teacher-story.component';
import { TeacherSettingsComponent } from './teacher-settings/teacher-settings.component';
import { TeacherDictoglossComponent } from './teacher-dictogloss/teacher-dictogloss.component';

import { QuillModule } from 'ngx-quill';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TeacherDashboardComponent,
    TeacherStudentComponent,
    TeacherClassroomComponent,
    TeacherStoryComponent,
    TeacherSettingsComponent,
    TeacherDictoglossComponent
  ],
  imports: [
    CommonModule,
    TeacherRoutingModule,
    FormsModule,
    MatCardModule,
    ReactiveFormsModule,
    QuillModule.forRoot({
      customOptions: [{
              import: 'formats/font',
              whitelist: [
                  'sans-serif',
                  'serif',
                  'monospace',
                  'arial',
                  'times-new-roman', // @quill-font
              ]
          }],
  }),
  ]
})
export class TeacherModule { }
