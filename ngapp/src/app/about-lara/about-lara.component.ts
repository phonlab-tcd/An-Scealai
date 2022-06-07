import { Component, OnInit } from '@angular/core';
import { TranslationService } from 'app/services/translation';

@Component({
  selector: 'app-about-lara',
  templateUrl: './about-lara.component.html',
  styleUrls: ['./about-lara.component.css']
})
export class AboutLaraComponent implements OnInit {

  constructor(public ts : TranslationService) { }

  ngOnInit() {
  }

}
