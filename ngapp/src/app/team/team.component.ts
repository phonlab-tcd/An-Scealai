import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../translation.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  constructor(public ts : TranslationService) { }

  ngOnInit() {
  }
}
