import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy  } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { AuthInterceptor } from 'app/core/interceptors/auth.interceptor';
import { StoryService } from 'app/core/services/story.service';
import { UserService } from './core/services/user.service';
import { LogService } from './core/services/log.service';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NavBarModule } from './nav-bar/nav-bar.module';


@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
        NavBarModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDialogModule // needed for route guards
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
