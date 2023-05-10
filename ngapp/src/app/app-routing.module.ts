import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from 'app/core/interceptors/auth.interceptor';

import { LandingComponent } from './landing/landing.component';
import { AboutComponent } from './about/about.component';
import { AboutLaraComponent } from './about-lara/about-lara.component';
import { TechnologyComponent } from './technology/technology.component';
import { ResourcesComponent } from './resources/resources.component';
import { TeamComponent } from './team/team.component';
import { SponsorsComponent } from './sponsors/sponsors.component';
import { UserGuidesComponent } from './user-guides/user-guides.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from 'register/register.component';
import { RegisterProfileComponent } from './register-profile/register-profile.component';
import { ProfileComponent } from './profile/profile.component';
import { MessagesComponent } from './messages/messages.component';
import { CreateQuizComponent } from './create-quiz/create-quiz.component';
import { AboutTaidhginComponent } from './about-taidhgin/about-taidhgin.component';
import { PromptsComponent } from './prompts/prompts.component';
import { DictoglossComponent } from './dictogloss/dictogloss.component';

import { DashboardComponent } from './student-components/dashboard/dashboard.component';
import { BookContentsComponent } from './student-components/book-contents/book-contents.component';
import { ChatbotComponent } from './student-components/chatbot/chatbot.component';
import { RecordingComponent } from './student-components/recording/recording.component';
import { SynthesisComponent } from './student-components/synthesis/synthesis.component';

import { AdminPanelComponent } from './admin-components/admin-panel/admin-panel.component';
import { TeachersComponent } from './admin-components/teachers/teachers.component';
import { UserComponent } from './admin-components/user/user.component';
import { AdminDashboardComponent } from './admin-components/admin-dashboard/admin-dashboard.component';
import { StoryComponent } from './admin-components/story/story.component';
import { AdminClassroomComponent } from './admin-components/admin-classroom/admin-classroom.component';
import { FindUserComponent } from './admin-components/find-user/find-user.component';
import { DatabaseStatsComponent } from './admin-components/database-stats/database-stats.component';
import { ProfileStatsComponent } from './admin-components/profile-stats/profile-stats.component';
import { FeatureStatsComponent } from './admin-components/feature-stats/feature-stats.component';
import { StoryHistoryComponent } from './admin-components/story-history/story-history.component';
import { AddContentComponent } from './admin-components/add-content/add-content.component';

import { TeacherPanelComponent } from './teacher-components/teacher-panel/teacher-panel.component';
import { TeacherDashboardComponent } from './teacher-components/teacher-dashboard/teacher-dashboard.component';
import { TeacherClassroomComponent } from './teacher-components/teacher-classroom/teacher-classroom.component';
import { TeacherStudentComponent } from './teacher-components/teacher-student/teacher-student.component';
import { TeacherStoryComponent } from './teacher-components/teacher-story/teacher-story.component';
import { TeacherSettingsComponent } from './teacher-components/teacher-settings/teacher-settings.component';
import { TeacherDictoglossComponent } from './teacher-components/teacher-dictogloss/teacher-dictogloss.component';
import { StatsDashboardComponent } from './stats-dashboard/stats-dashboard.component';

import { AuthGuardService } from 'app/core/services/auth-guard.service';
import { RoleGuardService } from 'app/core/services/role-guard.service';
import { NotificationService } from 'app/core/services/notification-service.service';
import { CanDeactivateDashboardGuard, CanDeactivateRecordingGuard } from 'app/core/guards/can-deactivate.guard';
import { StopSoundGuard } from 'app/core/guards/stop-sound.guard';

const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'landing', component: LandingComponent },
  { path: 'about', component: AboutComponent},
  { path: 'about-lara', component: AboutLaraComponent },
  { path: 'technology', component: TechnologyComponent},
  { path: 'resources', component: ResourcesComponent},
  { path: 'team', component: TeamComponent},
  { path: 'sponsors', component: SponsorsComponent},
  { path: 'user-guides', component: UserGuidesComponent},
  { path: 'login', component: LoginComponent},
  { path: 'register/:role', component: RegisterComponent},
  { path: 'register-profile', component: RegisterProfileComponent, canActivate: [AuthGuardService]},
  { path: 'dashboard/:id', component: DashboardComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateDashboardGuard] },
  { path: 'taidhgin', component: ChatbotComponent },
  { path: 'create-quiz', component: CreateQuizComponent, canActivate: [AuthGuardService] },
  { path: 'about-taidhgin', component: AboutTaidhginComponent },
  { path: 'prompts/:type', component: PromptsComponent},
  { path: 'dictogloss', component: DictoglossComponent, canActivate: [AuthGuardService], data :{ text:''} },
  { path: 'synthesis/:id', component: SynthesisComponent, canActivate: [AuthGuardService], canDeactivate: [StopSoundGuard] },
  { path: 'contents', component: BookContentsComponent, canActivate: [AuthGuardService] },
  { path: 'record-story/:id', component: RecordingComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateRecordingGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService]},
  { path: 'messages/:id', component: MessagesComponent, canActivate: [AuthGuardService]},
  { path: 'stats-dashboard/:id', component: StatsDashboardComponent,},
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
      },
      {
        path: 'add-content',
        component: AddContentComponent,
      },
      {
        path: 'database-stats',
        component: DatabaseStatsComponent,
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
        path: 'stats-dashboard/:id',
        component: StatsDashboardComponent,
      },
      {
        path: 'teacher-settings/:id',
        component: TeacherSettingsComponent,
      },
      {
        path: 'teacher-dictogloss/:id', 
        component: TeacherDictoglossComponent
      },
    ]
  },
  {
    path: 'report-an-issue',
    loadChildren: () => import('report-an-issue/report-an-issue.module')
      .then(m=>m.ReportAnIssueModule)
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
