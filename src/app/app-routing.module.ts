import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { AboutComponent } from './about/about.component';
import { TechnologyComponent } from './technology/technology.component';
import { LanguageComponent } from './language/language.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BookContentsComponent } from './book-contents/book-contents.component'; 

const routes: Routes = [
  { path: 'landing', component: LandingComponent},
  { path: 'about', component: AboutComponent},
  { path: 'technology', component: TechnologyComponent},
  { path: 'language', component: LanguageComponent},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'dashboard', component: DashboardComponent},
  { path: 'dashboard/contents', component: BookContentsComponent},
  { path: '', redirectTo: '/landing', pathMatch: 'full'},
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
