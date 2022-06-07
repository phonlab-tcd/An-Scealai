import { Component, OnInit } from '@angular/core';
import { TranslationService } from 'app/services/translation';

@Component({
  selector: 'app-sponsors',
  templateUrl: './sponsors.component.html',
  styleUrls: ['./sponsors.component.css']
})
export class SponsorsComponent implements OnInit {

  constructor(public ts : TranslationService) { }

  ngOnInit() {
  }

}
