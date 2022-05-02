import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

import { ReportAnIssueComponent } from './report-an-issue.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: ReportAnIssueComponent },
];

@NgModule({
  imports: [
    MatCardModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class ReportAnIssueRoutingModule { }
