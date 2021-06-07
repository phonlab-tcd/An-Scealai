import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../translation.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(public ts : TranslationService) { }

  ngOnInit() {
  }

}
