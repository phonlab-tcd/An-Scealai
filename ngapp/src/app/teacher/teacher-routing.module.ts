import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherDashboardComponent } from './teacher-dashboard/teacher-dashboard.component';
import { TeacherClassroomComponent } from './teacher-classroom/teacher-classroom.component';
import { TeacherStudentComponent } from './teacher-student/teacher-student.component';
import { TeacherStoryComponent } from './teacher-story/teacher-story.component';
import { TeacherSettingsComponent } from './teacher-settings/teacher-settings.component';
import { TeacherDictoglossComponent } from './teacher-dictogloss/teacher-dictogloss.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', pathMatch: 'full', component: TeacherDashboardComponent },
  { path: 'classroom/:id', pathMatch: 'full', component: TeacherClassroomComponent },
  { path: 'student/:id', pathMatch: 'full', component: TeacherStudentComponent },
  { path: 'story/:id', pathMatch: 'full', component: TeacherStoryComponent },
  { path: 'teacher-settings/:id', pathMatch: 'full', component: TeacherSettingsComponent },
  { path: 'teacher-dictogloss/:id', pathMatch: 'full', component: TeacherDictoglossComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }