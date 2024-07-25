import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from 'app/core/interceptors/auth.interceptor';

import { LandingComponent } from './landing/landing.component';

import { AuthGuardService } from 'app/core/services/auth-guard.service';
import { RoleGuardService } from 'app/core/services/role-guard.service';
import { NotificationService } from 'app/core/services/notification-service.service';


const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'landing', component: LandingComponent },
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)},
  { path: 'register/:role', loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent)},
  { path: 'register-profile', loadComponent: () => import('./profile/register-profile/register-profile.component').then(m => m.RegisterProfileComponent), canActivate: [AuthGuardService]},
  //{ path: 'taidhgin', component: ChatbotComponent },
  //{ path: 'create-quiz', component: CreateQuizComponent, canActivate: [AuthGuardService] },
  //{ path: 'about-taidhgin', component: AboutTaidhginComponent },
  { path: 'prompts/:type', loadComponent: () => import('./prompts/prompts.component').then(m => m.PromptsComponent)},
  { path: 'dictogloss', loadComponent: () => import('./dictogloss/dictogloss.component').then(m => m.DictoglossComponent), canActivate: [AuthGuardService], data :{ text:''} },
  { path: 'profile', loadComponent: () => import('./profile/profile/profile.component').then(m => m.ProfileComponent), canActivate: [AuthGuardService]},
  { path: 'messages/:id', loadComponent: () => import('./messages/messages.component').then(m => m.MessagesComponent), canActivate: [AuthGuardService]},
  { path: 'stats-dashboard/:id', loadComponent: () => import('./stats-dashboard/stats-dashboard.component').then(m => m.StatsDashboardComponent)},
  {
    path: 'student',
    data: { expectedRoles: ['STUDENT'] },
    canActivate: [RoleGuardService],
    loadChildren: () => import('./student/student.module').then(m=>m.StudentModule)
  },
  {
    path: 'teacher',
    data: { expectedRoles: ['TEACHER'] },
    canActivate: [RoleGuardService],
    loadChildren: () => import('./teacher/teacher.module').then(m=>m.TeacherModule)
  },
  {
    path: 'admin',
    canActivate: [RoleGuardService],
    data: { expectedRoles: ['ADMIN'] },
    loadChildren: () => import('./admin/admin.module').then(m=>m.AdminModule)
  },
];

@NgModule({
  imports:    [ RouterModule.forRoot(routes) ],
  exports:    [ RouterModule ],
  providers: [ 
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    NotificationService ],
})
export class AppRoutingModule { }
