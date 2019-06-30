import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { FormsModule } from '@angular/forms';

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
import { DashboardComponent } from './dashboard/dashboard.component';
import { BookContentsComponent } from './book-contents/book-contents.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { NewStoryComponent } from './new-story/new-story.component';
import { ProfileComponent } from './profile/profile.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';

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
    AdminPanelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    SlimLoadingBarModule,
    FormsModule
  ],
  providers: [ StoryService, UserService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
