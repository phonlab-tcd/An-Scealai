import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingComponent } from './landing/landing.component';
import { AboutComponent } from './about/about.component';
import { TechnologyComponent } from './technology/technology.component';
import { LanguageComponent } from './language/language.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RegisterTeacherComponent } from './register-teacher/register-teacher.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BookContentsComponent } from './book-contents/book-contents.component'; 
import { NewStoryComponent } from './new-story/new-story.component';
import { ProfileComponent } from './profile/profile.component';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { TeachersComponent } from './admin/teachers/teachers.component';
import { UserComponent } from './admin/user/user.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { StoryComponent } from './admin/story/story.component';

import { AuthGuardService } from './auth-guard.service';
import { RoleGuardService } from './role-guard.service';

const routes: Routes = [
  { path: 'landing', component: LandingComponent},
  { path: 'about', component: AboutComponent},
  { path: 'technology', component: TechnologyComponent},
  { path: 'language', component: LanguageComponent},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'register-teacher', component: RegisterTeacherComponent},
  { path: 'dashboard/:id', component: DashboardComponent, canActivate: [AuthGuardService] },
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
    ]
  },
  { path: '', redirectTo: '/landing', pathMatch: 'full'},
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
