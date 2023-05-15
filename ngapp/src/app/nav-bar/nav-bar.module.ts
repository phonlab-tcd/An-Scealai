import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion'
import { MatCardModule } from '@angular/material/card';

import { NavBarRoutingModule } from './nav-bar-routing.module';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AboutComponent } from './about/about.component';
import { AboutLaraComponent } from './about-lara/about-lara.component';
import { TechnologyComponent } from './technology/technology.component';
import { UserGuidesComponent } from './user-guides/user-guides.component';
import { SponsorsComponent } from './sponsors/sponsors.component';
import { TeamComponent } from './team/team.component';
import { ReportAnIssueComponent } from './report-an-issue/report-an-issue.component';
import { ResourcesComponent } from './resources/resources.component';
import { AboutTaidhginComponent } from './about-taidhgin/about-taidhgin.component';

@NgModule({
  declarations: [
    NavBarComponent,
    AboutComponent,
    AboutLaraComponent,
    TechnologyComponent,
    UserGuidesComponent,
    SponsorsComponent,
    TeamComponent,
    ReportAnIssueComponent,
    ResourcesComponent,
    AboutTaidhginComponent
  ],
  exports: [NavBarComponent],
  imports: [
    CommonModule,
    NavBarRoutingModule,
    NgbDropdownModule,
    NgbModule,
    MatExpansionModule,
    MatCardModule
  ]
})
export class NavBarModule { }
