import { Component, OnInit } from '@angular/core';
import { TranslationService } from 'app/core/services/translation.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {

  constructor(public ts : TranslationService) { }

  ngOnInit() {
  }
}
