import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion'
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {TooltipPosition, MatTooltipModule} from '@angular/material/tooltip';

import { NavBarRoutingModule } from './nav-bar-routing.module';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { StudentModule } from '../student/student.module'; // added by David 05/07/2024

import { AboutComponent } from './about/about.component';
import { AboutLaraComponent } from './about-lara/about-lara.component';
import { TechnologyComponent } from './technology/technology.component';
import { UserGuidesComponent } from './user-guides/user-guides.component';
import { SponsorsComponent } from './sponsors/sponsors.component';
import { TeamComponent } from './team/team.component';
import { ReportAnIssueComponent } from './report-an-issue/report-an-issue.component';
import { ResourcesComponent } from './resources/resources.component';
import { DigitalReaderComponent } from './digital-reader/digital-reader.component';
import { DigitalReaderLibraryComponent } from './digital-reader-library/digital-reader-library.component';
import { DigitalReaderStoryDrawerComponent } from './dr-story-drawer/dr-story-drawer.component';
import { AboutTaidhginComponent } from './about-taidhgin/about-taidhgin.component';
import { FiosComponent } from './fios/fios.component';

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
    DigitalReaderComponent,
    DigitalReaderLibraryComponent,
    DigitalReaderStoryDrawerComponent,
    AboutTaidhginComponent,
    FiosComponent
  ],
  exports: [NavBarComponent],
  imports: [
    CommonModule,
    NavBarRoutingModule,
    NgbDropdownModule,
    NgbModule,
    MatExpansionModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatCheckboxModule, // added by David 04/07/2024
    StudentModule, // added by David 05/07/2024
    MatTabsModule,
    MatButtonModule,
    MatDividerModule,
    FormsModule,
    MatInputModule,
    //MatFormFieldModule,
    MatSnackBarModule,
    MatTooltipModule
  ]
})
export class NavBarModule { }
