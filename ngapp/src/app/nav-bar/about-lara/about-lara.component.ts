import { Component, OnInit } from '@angular/core';
import { TranslationService } from 'app/core/services/translation.service';

@Component({
  selector: 'app-about-lara',
  templateUrl: './about-lara.component.html',
  styleUrls: ['./about-lara.component.scss']
})
export class AboutLaraComponent implements OnInit {

  constructor(public ts : TranslationService) { }

  ngOnInit() {
  }

}
