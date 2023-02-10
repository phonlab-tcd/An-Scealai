import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TextInputHighlightModule } from 'angular-text-input-highlight';
import { HashLocationStrategy, LocationStrategy  } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatExpansionModule } from '@angular/material/expansion'
import { MatCardModule } from '@angular/material/card'
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { QuillModule } from 'ngx-quill';

import { RegisterModule } from 'register/register.module';
import { AuthInterceptor } from 'app/interceptor/auth.interceptor';
import { SpinnerModule } from 'spinner/spinner.module';

import { NgramDistributionModule } from 'app/story-stats/ngram-distribution/ngram-distribution.module';
import { WordCountsModule } from 'app/story-stats/word-counts/word-counts.module';
import { GrammarPieChartModule } from 'app/story-stats/grammar-pie-chart/grammar-pie-chart.module';
import { DictionaryLookupsModule } from 'app/story-stats/dictionary-lookups/dictionary-lookups.module';
import { StatsDashboardComponent } from './stats-dashboard/stats-dashboard.component';
import { ClassroomSelectorComponent } from './stats-dashboard/classroom-selector/classroom-selector.component';

import { FilterPipe } from './pipes/filter.pipe';
import { HighlightDirective } from './directives/highlight.directive';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';

import { StoryService } from './story.service';
import { UserService } from './user.service';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LandingComponent } from './landing/landing.component';
import { AboutComponent } from './about/about.component';
import { TechnologyComponent } from './technology/technology.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { ReportAnIssueModule } from 'report-an-issue/report-an-issue.module';
import { RegisterProfileComponent } from './register-profile/register-profile.component';
import { MessagesComponent } from './messages/messages.component';
import { ResourcesComponent } from './resources/resources.component';
import { TeamComponent } from './team/team.component';
import { AboutLaraComponent } from './about-lara/about-lara.component';
import { SponsorsComponent } from './sponsors/sponsors.component';
import { CreateQuizComponent } from './create-quiz/create-quiz.component';
import { AboutTaidhginComponent } from './about-taidhgin/about-taidhgin.component';
import { SynthItemComponent } from './synth-item/synth-item.component';
import { SynthVoiceSelectComponent } from './synth-voice-select/synth-voice-select.component';
import { BasicDialogComponent } from './dialogs/basic-dialog/basic-dialog.component';
import { RecordingDialogComponent } from './dialogs/recording-dialog/recording-dialog.component';
import { UserGuidesComponent } from './user-guides/user-guides.component';

import { DashboardComponent } from './student-components/dashboard/dashboard.component';
import { BookContentsComponent } from './student-components/book-contents/book-contents.component';
import { ChatbotComponent } from './student-components/chatbot/chatbot.component';
import { SynthesisComponent } from './student-components/synthesis/synthesis.component';
import { RecordingHistoryComponent } from './student-components/recording-history/recording-history.component';
import { ViewRecordingComponent } from './student-components/view-recording/view-recording.component';
import { SynthesisPlayerComponent } from './student-components/synthesis-player/synthesis-player.component';

import { AdminPanelComponent } from './admin-components/admin-panel/admin-panel.component';
import { TeachersComponent } from './admin-components/teachers/teachers.component';
import { AdminDashboardComponent } from './admin-components/admin-dashboard/admin-dashboard.component';
import { UserComponent } from './admin-components/user/user.component';
import { StoryComponent } from './admin-components/story/story.component';
import { FindUserComponent } from './admin-components/find-user/find-user.component';
import { ProfileStatsComponent } from './admin-components/profile-stats/profile-stats.component';
import { FeatureStatsComponent } from './admin-components/feature-stats/feature-stats.component';

import { TeacherDashboardComponent } from './teacher-components/teacher-dashboard/teacher-dashboard.component';
import { TeacherStudentComponent } from './teacher-components/teacher-student/teacher-student.component';
import { TeacherClassroomComponent } from './teacher-components/teacher-classroom/teacher-classroom.component';
import { TeacherStoryComponent } from './teacher-components/teacher-story/teacher-story.component';
import { TeacherPanelComponent } from './teacher-components/teacher-panel/teacher-panel.component';
import { AdminClassroomComponent } from './admin-components/admin-classroom/admin-classroom.component';
import { StoryHistoryComponent } from './admin-components/story-history/story-history.component';
import { RecordingComponent } from './student-components/recording/recording.component';
import { TeacherSettingsComponent } from './teacher-components/teacher-settings/teacher-settings.component';
import { DatabaseStatsComponent } from './admin-components/database-stats/database-stats.component';

@NgModule({
    declarations: [
        AppComponent,
        LandingComponent,
        AboutComponent,
        TechnologyComponent,
        LoginComponent,
        //     RegisterComponent,
        //     RegisterFormComponent,
        //     WaitingForEmailVerificationComponent,
        DashboardComponent,
        BookContentsComponent,
        ChatbotComponent,
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
        FindUserComponent,
        HighlightDirective,
        FilterPipe,
        MessagesComponent,
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
        ClassroomSelectorComponent,
        BasicDialogComponent,
        RecordingDialogComponent,
        UserGuidesComponent,
        TeacherSettingsComponent,
        DatabaseStatsComponent,
    ],
    imports: [
        RegisterModule,
        ReportAnIssueModule,
        SpinnerModule,
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
        TextInputHighlightModule,
        BrowserAnimationsModule,
        MatExpansionModule,
        MatCardModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,
        MatDialogModule,
        NgbModule,
        NgbDropdownModule,
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
        NgramDistributionModule,
        WordCountsModule,
        GrammarPieChartModule,
        DictionaryLookupsModule
    ],
    providers: [
        StoryService,
        UserService,
        MatDatepickerModule,
        MatNativeDateModule,
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: MatDialogRef, useValue: {} },
    ],
    bootstrap: [
        AppComponent,
    ]
})
export class AppModule {
  constructor(private injector: Injector) {
  }
 }
