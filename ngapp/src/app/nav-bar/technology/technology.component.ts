import { Component, OnInit } from '@angular/core';
import { TranslationService } from 'app/core/services/translation.service';

@Component({
  selector: 'app-technology',
  templateUrl: './technology.component.html',
  styleUrls: ['./technology.component.scss']
})
export class TechnologyComponent implements OnInit {

  constructor(public ts : TranslationService) { }

  ngOnInit() {
  }

}
