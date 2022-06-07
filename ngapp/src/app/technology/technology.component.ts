import { Component, OnInit } from '@angular/core';
import { TranslationService } from 'app/services/translation';

@Component({
  selector: 'app-technology',
  templateUrl: './technology.component.html',
  styleUrls: ['./technology.component.css']
})
export class TechnologyComponent implements OnInit {

  constructor(public ts : TranslationService) { }

  ngOnInit() {
  }

}
