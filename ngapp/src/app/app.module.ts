import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
//import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { FormsModule } from '@angular/forms';
import { TextInputHighlightModule } from 'angular-text-input-highlight';
import { createCustomElement } from '@angular/elements';
import { HashLocationStrategy, LocationStrategy  } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatExpansionModule } from '@angular/material/expansion'
import { MatCardModule } from '@angular/material/card'
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { RegisterModule } from 'register/register.module';
import { AuthInterceptor } from 'app/interceptor/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { NgramDistributionModule } from 'app/story-stats/ngram-distribution/ngram-distribution.module';
import { GrammarErrorsModule } from 'app/story-stats/grammar-errors/grammar-errors.module';

import { FilterPipe } from './pipes/filter.pipe';
import { HighlightDirective } from './directives/highlight.directive';

import { StoryService } from './story.service';
import { UserService } from './user.service';

import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { AppRoutingModule } from './app-routing.module';
import { AboutComponent } from './about/about.component';
import { TechnologyComponent } from './technology/technology.component';
import { LanguageComponent } from './language/language.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { ReportAnIssueModule } from 'report-an-issue/report-an-issue.module';

import { DashboardComponent } from './student-components/dashboard/dashboard.component';
import { BookContentsComponent } from './student-components/book-contents/book-contents.component';
import { ChatbotComponent } from './student-components/chatbot/chatbot.component';
import { NewStoryComponent } from './student-components/new-story/new-story.component';
import { SynthesisComponent } from './student-components/synthesis/synthesis.component';

import { AdminPanelComponent } from './admin-components/admin-panel/admin-panel.component';
import { TeachersComponent } from './admin-components/teachers/teachers.component';
import { AdminDashboardComponent } from './admin-components/admin-dashboard/admin-dashboard.component';
import { UserComponent } from './admin-components/user/user.component';
import { StoryComponent } from './admin-components/story/story.component';

import { TeacherDashboardComponent } from './teacher-components/teacher-dashboard/teacher-dashboard.component';
import { TeacherStudentComponent } from './teacher-components/teacher-student/teacher-student.component';
import { TeacherClassroomComponent } from './teacher-components/teacher-classroom/teacher-classroom.component';
import { TeacherStoryComponent } from './teacher-components/teacher-story/teacher-story.component';
import { TeacherPanelComponent } from './teacher-components/teacher-panel/teacher-panel.component';
import { AdminClassroomComponent } from './admin-components/admin-classroom/admin-classroom.component';
import { StoryHistoryComponent } from './admin-components/story-history/story-history.component';
import { RecordingComponent } from './student-components/recording/recording.component';
import { RegisterProfileComponent } from './register-profile/register-profile.component';
import { StoryDetailsComponent } from './student-components/story-details/story-details.component';
import { StatsComponent } from './admin-components/stats/stats.component';
import { FindUserComponent } from './admin-components/find-user/find-user.component';
import { MessagesComponent } from './messages/messages.component';
import { TeacherStatsComponent } from './teacher-components/teacher-stats/teacher-stats.component';
import { ResourcesComponent } from './resources/resources.component';
import { TeamComponent } from './team/team.component';
import { AboutLaraComponent } from './about-lara/about-lara.component';
import { RecordingHistoryComponent } from './student-components/recording-history/recording-history.component';
import { ViewRecordingComponent } from './student-components/view-recording/view-recording.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { SponsorsComponent } from './sponsors/sponsors.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { QuillModule } from 'ngx-quill';
import { SpinnerModule } from 'spinner/spinner.module';
import { SynthesisPlayerComponent } from './student-components/synthesis-player/synthesis-player.component';
import { ProfileStatsComponent } from './admin-components/profile-stats/profile-stats.component';
import { FeatureStatsComponent } from './admin-components/feature-stats/feature-stats.component';
import { CreateQuizComponent } from './create-quiz/create-quiz.component';
import { AboutTaidhginComponent } from './about-taidhgin/about-taidhgin.component';
import { SynthItemComponent } from './synth-item/synth-item.component';
import { SynthVoiceSelectComponent } from './synth-voice-select/synth-voice-select.component';
import { StatsDashboardComponent } from './teacher-components/stats-dashboard/stats-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    AboutComponent,
    TechnologyComponent,
    LanguageComponent,
    LoginComponent,
//     RegisterComponent,
//     RegisterFormComponent,
//     WaitingForEmailVerificationComponent,
    DashboardComponent,
    BookContentsComponent,
    ChatbotComponent,
    NewStoryComponent,
    ProfileComponent,
    AdminPanelComponent,
    TeachersComponent,
    AdminDashboardComponent,
    UserComponent,
    StoryComponent,
    TeacherDashboardComponent,
    TeacherStudentComponent,
    TeacherClassroomComponent,
    TeacherStoryComponent,
    TeacherPanelComponent,
    AdminClassroomComponent,
    SynthesisComponent,
    StoryHistoryComponent,
    RecordingComponent,
    RegisterProfileComponent,
    StoryDetailsComponent,
    StatsComponent,
    FindUserComponent,
    HighlightDirective,
    FilterPipe,
    MessagesComponent,
    TeacherStatsComponent,
    ResourcesComponent,
    TeamComponent,
    AboutLaraComponent,
    RecordingHistoryComponent,
    ViewRecordingComponent,
    SafeHtmlPipe,
    SponsorsComponent,
    SynthesisPlayerComponent,
    ProfileStatsComponent,
    FeatureStatsComponent,
    CreateQuizComponent,
    AboutTaidhginComponent,
    SynthItemComponent,
    SynthVoiceSelectComponent,
    StatsDashboardComponent,
  ],
  imports: [
    RegisterModule,
    ReportAnIssueModule,
    SpinnerModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    // SlimLoadingBarModule,
    FormsModule,
    TextInputHighlightModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatSelectModule,
    NgbModule,
    NgbDropdownModule,
    QuillModule.forRoot({
      customOptions: [{
        import: 'formats/font',
        whitelist: [
          'sans-serif',         // @quill-font
          'serif',              // @quill-font
          'monospace',          // @quill-font
          'arial',              // @quill-font
          'times-new-roman',    // @quill-font
        ]
      }],
    }),
    NgramDistributionModule,
    GrammarErrorsModule
  ],
  providers: [
    StoryService,
    UserService,
    MatDatepickerModule,
    MatNativeDateModule,
    {provide : LocationStrategy , useClass: HashLocationStrategy },
    {provide : HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ],
  bootstrap: [
    AppComponent,
  ],
  entryComponents: [ChatbotComponent],
})
export class AppModule {
  constructor(private injector: Injector) {
    //const chatbotElement = createCustomElement(ChatbotComponent, {injector});
    //customElements.define('app-chatbot', chatbotElement);
  }
 }
