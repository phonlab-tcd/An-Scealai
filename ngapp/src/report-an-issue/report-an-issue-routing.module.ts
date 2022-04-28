import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportAnIssueComponent } from './report-an-issue.component';
import { MatCardModule } from '@angular/material/card';

const routes: Routes = [{ path: 'report-an-issue', component: ReportAnIssueComponent }];

@NgModule({
  imports: [
    MatCardModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class ReportAnIssueRoutingModule { }
