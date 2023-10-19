import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextInputHighlightModule } from 'angular-text-input-highlight';
import { CommonModule, HashLocationStrategy, LocationStrategy  } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthInterceptor } from 'app/core/interceptors/auth.interceptor';
import { StoryService } from 'app/core/services/story.service';
import { UserService } from './core/services/user.service';
import { LogService } from './core/services/log.service';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { AppRoutingModule } from './app-routing.module';
import { RegisterModule } from 'app/register/register.module';
import { DictionaryLookupsModule } from './story-stats/dictionary-lookups/dictionary-lookups.module';
import { GrammarPieChartModule } from './story-stats/grammar-pie-chart/grammar-pie-chart.module';
import { GrammarErrorTimeModule } from './story-stats/grammar-error-time/grammar-error-time.module';
import { NgramDistributionModule } from './story-stats/ngram-distribution/ngram-distribution.module';
import { WordCountsModule } from './story-stats/word-counts/word-counts.module';
import { NavBarModule } from './nav-bar/nav-bar.module';
import { ProfileModule } from './profile/profile.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SynthItemModule } from './synth-item/synth-item.module';
import { SynthVoiceSelectModule } from './synth-voice-select/synth-voice-select.module';

import { SpinnerModule } from './spinner/spinner.module';


@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        AppRoutingModule,
        NavBarModule,
        ProfileModule,
        RegisterModule,
        FormsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDialogModule,
        MatProgressSpinnerModule,
    ],
    providers: [
        StoryService,
        UserService,
        LogService,
        MatDatepickerModule,
        MatNativeDateModule,
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
//   constructor(private injector: Injector) {
//   }
 }
