import { Component, OnInit } from '@angular/core';
import { TranslationService } from 'app/core/services/translation.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor(public ts : TranslationService) { }

  ngOnInit() {
  }

}
