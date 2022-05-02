import { Component, OnInit } from '@angular/core';
import { TranslationService } from 'app/translation.service';

@Component({
  selector: 'app-report',
  templateUrl: './report-an-issue.component.html',
  styleUrls: ['./report-an-issue.component.css']
})
export class ReportAnIssueComponent implements OnInit {

  constructor(public ts: TranslationService) { }

  ngOnInit() {
  }

}
