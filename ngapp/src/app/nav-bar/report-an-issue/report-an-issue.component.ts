import { Component          } from '@angular/core';
import { TranslationService } from 'app/core/services/translation.service';

@Component({
  selector: 'app-report',
  templateUrl: './report-an-issue.component.html',
  styleUrls: ['./report-an-issue.component.scss']
})
export class ReportAnIssueComponent {
  constructor(public ts: TranslationService) { }
}
