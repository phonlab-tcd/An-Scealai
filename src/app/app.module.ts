import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { FormsModule } from '@angular/forms';
import { TextInputHighlightModule } from 'angular-text-input-highlight';
import { createCustomElement } from '@angular/elements';
import { HashLocationStrategy, LocationStrategy  } from '@angular/common';
import { FilterPipe } from './pipes/filter.pipe';
import { HighlightDirective } from './directives/highlight.directive';
import { QuillModule } from 'ngx-quill';

import { StoryService } from './story.service';
import { UserService } from './user.service';

import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { AppRoutingModule } from './app-routing.module';
import { AboutComponent } from './about/about.component';
import { TechnologyComponent } from './technology/technology.component';
import { LanguageComponent } from './language/language.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterTeacherComponent } from './register-teacher/register-teacher.component';

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




@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    AboutComponent,
    TechnologyComponent,
    LanguageComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    BookContentsComponent,
    ChatbotComponent,
    NewStoryComponent,
    ProfileComponent,
    AdminPanelComponent,
    TeachersComponent,
    AdminDashboardComponent,
    RegisterTeacherComponent,
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
    TeacherStatsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    SlimLoadingBarModule,
    FormsModule,
    TextInputHighlightModule,
    QuillModule.forRoot()
  ],
  providers: [ 
    StoryService,
    UserService,
    {provide : LocationStrategy , useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent],
  entryComponents: [ChatbotComponent],
})
export class AppModule {
  constructor(private injector: Injector) {
    const chatbotElement = createCustomElement(ChatbotComponent, {injector});
    customElements.define('app-chatbot', chatbotElement);
  }
 }
