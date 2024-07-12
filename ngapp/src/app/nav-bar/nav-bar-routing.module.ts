import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutComponent } from './about/about.component';
import { AboutLaraComponent } from './about-lara/about-lara.component';
import { TechnologyComponent } from './technology/technology.component';
import { UserGuidesComponent } from './user-guides/user-guides.component';
import { SponsorsComponent } from './sponsors/sponsors.component';
import { TeamComponent } from './team/team.component';
import { ReportAnIssueComponent } from './report-an-issue/report-an-issue.component';
import { ResourcesComponent } from './resources/resources.component';
import { DigitalReaderComponent } from './digital-reader/digital-reader.component';
import { AboutTaidhginComponent } from './about-taidhgin/about-taidhgin.component';
import { FiosComponent } from './fios/fios.component';

const routes: Routes = [
  { path: 'about', component: AboutComponent},
  { path: 'fios', component: FiosComponent},
  { path: 'about-lara', component: AboutLaraComponent },
  { path: 'technology', component: TechnologyComponent},
  { path: 'resources', component: ResourcesComponent},
  { path: 'digital-reader', component: DigitalReaderComponent},
  { path: 'team', component: TeamComponent},
  { path: 'sponsors', component: SponsorsComponent},
  { path: 'user-guides', component: UserGuidesComponent},
  { path: 'report-an-issue', component: ReportAnIssueComponent},
  { path: 'about-taidhgin', component: AboutTaidhginComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NavBarRoutingModule { }
