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
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSortModule } from '@angular/material/sort';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import { QuillModule } from 'ngx-quill';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { RegisterModule } from 'register/register.module';
import { AuthInterceptor } from 'app/core/interceptors/auth.interceptor';
import { SpinnerModule } from 'spinner/spinner.module';

import { ClassroomSelectorComponent } from './stats-dashboard/classroom-selector/classroom-selector.component';

import { FilterPipe } from './pipes/filter.pipe';
import { HighlightDirective } from './directives/highlight.directive';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';

import { StoryService } from 'app/core/services/story.service';
import { UserService } from './core/services/user.service';

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
import { BasicDialogComponent } from './dialogs/basic-dialog/basic-dialog.component';
import { RecordingDialogComponent } from './dialogs/recording-dialog/recording-dialog.component';
import { UserGuidesComponent } from './user-guides/user-guides.component';

import { ChatbotComponent } from './chatbot/chatbot.component';
import { SynthesisComponent } from './student/synthesis/synthesis.component';
import { RecordingComponent } from './student/recording/recording.component';

import { PromptsComponent } from './prompts/prompts.component';
import { PartOfSpeechComponent } from './prompts/part-of-speech/part-of-speech.component';
import { DictoglossComponent } from './dictogloss/dictogloss.component';


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
        ChatbotComponent,
        ProfileComponent,
        SynthesisComponent,
        RecordingComponent,
        RegisterProfileComponent,
        HighlightDirective,
        //FilterPipe,
        MessagesComponent,
        ResourcesComponent,
        TeamComponent,
        AboutLaraComponent,
        SafeHtmlPipe,
        SponsorsComponent,
        CreateQuizComponent,
        AboutTaidhginComponent,
        SynthItemComponent,
        ClassroomSelectorComponent,
        BasicDialogComponent,
        RecordingDialogComponent,
        UserGuidesComponent,
        PromptsComponent,
        PartOfSpeechComponent,
        DictoglossComponent,
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
        MatSidenavModule,
        MatIconModule,
        MatTableModule,
        MatInputModule,
        MatPaginatorModule,
        MatSortModule,
        NgbModule,
        NgbDropdownModule,
        // QuillModule.forRoot({
        //     customOptions: [{
        //             import: 'formats/font',
        //             whitelist: [
        //                 'sans-serif',
        //                 'serif',
        //                 'monospace',
        //                 'arial',
        //                 'times-new-roman', // @quill-font
        //             ]
        //         }],
        // }),
        PdfViewerModule
    ],
    providers: [
        StoryService,
        UserService,
        MatDatepickerModule,
        MatNativeDateModule,
        MatPaginator,
        MatSort,
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        
    ],
    bootstrap: [
        AppComponent,
    ]
})
export class AppModule {
  constructor(private injector: Injector) {
  }
 }
