import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../translation.service';

@Component({
  selector: 'app-report_an_issue',
  templateUrl: './report_an_issue.component.html',
  styleUrls: ['./report_an_issue.component.css']
})
export class ReportAnIssueComponent implements OnInit {

  constructor(public ts : TranslationService) { }

  ngOnInit() {
  }

}
