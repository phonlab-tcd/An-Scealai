import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

import { ReportAnIssueRoutingModule } from './report-an-issue-routing.module';
import { ReportAnIssueComponent } from './report-an-issue.component';

@NgModule({
  declarations: [
    ReportAnIssueComponent
  ],
  imports: [
    CommonModule,
    ReportAnIssueRoutingModule,
    MatCardModule,
  ]
})
export class ReportAnIssueModule { }
