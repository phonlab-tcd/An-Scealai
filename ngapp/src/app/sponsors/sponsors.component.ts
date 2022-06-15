import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../translation.service';

@Component({
  selector: 'app-sponsors',
  templateUrl: './sponsors.component.html',
  styleUrls: ['./sponsors.component.scss']
})
export class SponsorsComponent implements OnInit {

  constructor(public ts : TranslationService) { }

  ngOnInit() {
  }

}
