import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingComponent } from './landing/landing.component';
import { AboutComponent } from './about/about.component';
import { TechnologyComponent } from './technology/technology.component';
import { LanguageComponent } from './language/language.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RegisterTeacherComponent } from './register-teacher/register-teacher.component';
import { ProfileComponent } from './profile/profile.component';

import { DashboardComponent } from './student-components/dashboard/dashboard.component';
import { BookContentsComponent } from './student-components/book-contents/book-contents.component'; 
import { NewStoryComponent } from './student-components/new-story/new-story.component';

import { AdminPanelComponent } from './admin-components/admin-panel/admin-panel.component';
import { TeachersComponent } from './admin-components/teachers/teachers.component';
import { UserComponent } from './admin-components/user/user.component';
import { AdminDashboardComponent } from './admin-components/admin-dashboard/admin-dashboard.component';
import { StoryComponent } from './admin-components/story/story.component';
import { AdminClassroomComponent } from './admin-components/admin-classroom/admin-classroom.component';

import { TeacherPanelComponent } from './teacher-components/teacher-panel/teacher-panel.component';
import { TeacherDashboardComponent } from './teacher-components/teacher-dashboard/teacher-dashboard.component';
import { TeacherClassroomComponent } from './teacher-components/teacher-classroom/teacher-classroom.component';
import { TeacherStudentComponent } from './teacher-components/teacher-student/teacher-student.component';
import { TeacherStoryComponent } from './teacher-components/teacher-story/teacher-story.component';

import { AuthGuardService } from './auth-guard.service';
import { RoleGuardService } from './role-guard.service';
import { SynthesisComponent } from './student-components/synthesis/synthesis.component';

const routes: Routes = [
  { path: 'landing', component: LandingComponent},
  { path: 'about', component: AboutComponent},
  { path: 'technology', component: TechnologyComponent},
  { path: 'language', component: LanguageComponent},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'register-teacher', component: RegisterTeacherComponent},
  { path: 'dashboard/:id', component: DashboardComponent, canActivate: [AuthGuardService] },
  { path: 'synthesis/:id', component: SynthesisComponent, canActivate: [AuthGuardService] },
  { path: 'contents', component: BookContentsComponent, canActivate: [AuthGuardService] },
  { path: 'new-story', component: NewStoryComponent, canActivate: [AuthGuardService] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService] },
  { path: 'admin', 
    component: AdminPanelComponent, 
    canActivate: [RoleGuardService],
    data: { expectedRole: 'ADMIN' },
    children: [
      {
        path: '', 
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: AdminDashboardComponent,
      },
      {
        path: 'teachers',
        component: TeachersComponent,
      },
      {
        path: 'user/:id',
        component: UserComponent,
      },
      {
        path: 'story/:id',
        component: StoryComponent,
      },
      {
        path: 'classroom/:id',
        component: AdminClassroomComponent,
      },
    ]
  },
  { path: 'teacher', 
    component: TeacherPanelComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'TEACHER' },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: TeacherDashboardComponent,
      },
      {
        path: 'classroom/:id',
        component: TeacherClassroomComponent,
      },
      {
        path: 'student/:id',
        component: TeacherStudentComponent,
      },
      {
        path: 'story/:id',
        component: TeacherStoryComponent,
      }
    ]
  },
  { path: '', redirectTo: '/landing', pathMatch: 'full'},
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
