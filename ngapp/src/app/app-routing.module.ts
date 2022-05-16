import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingComponent } from './landing/landing.component';
import { AboutComponent } from './about/about.component';
import { AboutLaraComponent } from './about-lara/about-lara.component';
import { TechnologyComponent } from './technology/technology.component';
import { ResourcesComponent } from './resources/resources.component';
import { TeamComponent } from './team/team.component';
import { SponsorsComponent } from './sponsors/sponsors.component';
import { LanguageComponent } from './language/language.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from 'register/register.component';
import { RegisterProfileComponent } from './register-profile/register-profile.component';
import { ProfileComponent } from './profile/profile.component';

import { DashboardComponent } from './student-components/dashboard/dashboard.component';
import { BookContentsComponent } from './student-components/book-contents/book-contents.component';
import { NewStoryComponent } from './student-components/new-story/new-story.component';
import { ChatbotComponent } from './student-components/chatbot/chatbot.component';
import { StoryDetailsComponent } from './student-components/story-details/story-details.component';

// import { RecordingComponent } from './student-components/recording/recording.component';
// import { RecordingHistoryComponent } from './student-components/recording-history/recording-history.component';
import { ViewRecordingComponent } from './student-components/view-recording/view-recording.component';
import { MessagesComponent } from './messages/messages.component';

import { AdminPanelComponent } from './admin-components/admin-panel/admin-panel.component';
import { TeachersComponent } from './admin-components/teachers/teachers.component';
import { UserComponent } from './admin-components/user/user.component';
import { AdminDashboardComponent } from './admin-components/admin-dashboard/admin-dashboard.component';
import { StoryComponent } from './admin-components/story/story.component';
import { AdminClassroomComponent } from './admin-components/admin-classroom/admin-classroom.component';
import { StatsComponent } from './admin-components/stats/stats.component';
import { FindUserComponent } from './admin-components/find-user/find-user.component';
import { ProfileStatsComponent } from './admin-components/profile-stats/profile-stats.component';
import { FeatureStatsComponent } from './admin-components/feature-stats/feature-stats.component';

import { TeacherPanelComponent } from './teacher-components/teacher-panel/teacher-panel.component';
import { TeacherDashboardComponent } from './teacher-components/teacher-dashboard/teacher-dashboard.component';
import { TeacherClassroomComponent } from './teacher-components/teacher-classroom/teacher-classroom.component';
import { TeacherStudentComponent } from './teacher-components/teacher-student/teacher-student.component';
import { TeacherStoryComponent } from './teacher-components/teacher-story/teacher-story.component';
import { TeacherStatsComponent } from './teacher-components/teacher-stats/teacher-stats.component';

import { AuthGuardService } from './auth-guard.service';
import { RoleGuardService } from './role-guard.service';
import { NotificationService } from './notification-service.service';
import { SynthesisComponent } from './student-components/synthesis/synthesis.component';
import { CanDeactivateDashboardGuard, } from './can-deactivate.guard';
import { StopSoundGuard } from './stop-sound.guard';
import { StoryHistoryComponent } from './admin-components/story-history/story-history.component';
import { CreateQuizComponent } from './create-quiz/create-quiz.component';
import { AboutTaidhginComponent } from './about-taidhgin/about-taidhgin.component';

const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'landing', component: LandingComponent },
  { path: 'about', component: AboutComponent},
  { path: 'about-lara', component: AboutLaraComponent },
  { path: 'technology', component: TechnologyComponent},
  { path: 'resources', component: ResourcesComponent},
  { path: 'team', component: TeamComponent},
  { path: 'sponsors', component: SponsorsComponent},
  { path: 'language', component: LanguageComponent},
  { path: 'login', component: LoginComponent},
  { path: 'register/:role', component: RegisterComponent},
  { path: 'register-profile', component: RegisterProfileComponent, canActivate: [AuthGuardService]},
  { path: 'dashboard/:id', component: DashboardComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateDashboardGuard] },
  { path: 'taidhgin', component: ChatbotComponent },
  { path: 'create-quiz', component: CreateQuizComponent, canActivate: [AuthGuardService] },
  { path: 'about-taidhgin', component: AboutTaidhginComponent },
  { path: 'synthesis/:id', component: SynthesisComponent, canActivate: [AuthGuardService], canDeactivate: [StopSoundGuard] },
  { path: 'contents', component: BookContentsComponent, canActivate: [AuthGuardService] },
  { path: 'new-story', component: NewStoryComponent, canActivate: [AuthGuardService] },
  { path: 'story-details/:id', component: StoryDetailsComponent, canActivate: [AuthGuardService] },
  // { path: 'record-story/:id', component: RecordingComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateRecordingGuard] },
  // { path: 'view-recording/:id', component: ViewRecordingComponent, canActivate: [AuthGuardService]},
  // { path: 'recording-archive/:id', component: RecordingHistoryComponent, canActivate: [AuthGuardService]},
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService]},
  { path: 'messages/:id', component: MessagesComponent, canActivate: [AuthGuardService]},
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
      {
        path: 'story-history/:id',
        component: StoryHistoryComponent,
      },
      {
        path: 'stats',
        component: StatsComponent,
      },
      {
        path: 'find-user',
        component: FindUserComponent,
      },
      {
        path: 'profile-stats',
        component: ProfileStatsComponent,
      },
      {
        path: 'feature-stats',
        component: FeatureStatsComponent,
      }
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
      },
      {
        path: 'teacher-stats/:id',
        component: TeacherStatsComponent,
      }
    ]
  },
  {
    path: 'report-an-issue',
    loadChildren: () => import('report-an-issue/report-an-issue.module')
      .then(m=>m.ReportAnIssueModule)
  },
  { 
    path: 'record-yourself',
    loadChildren: () => import('record-yourself/module')
      .then(m => m.RecordYourselfModule) },
];

@NgModule({
  imports:    [ RouterModule.forRoot(routes) ],
  exports:    [ RouterModule ],
  providers:  [ NotificationService ]
})
export class AppRoutingModule { }
