import { Component, OnInit } from '@angular/core';
import { TranslationService } from 'app/core/services/translation.service';

@Component({
  selector: 'app-about-taidhgin',
  templateUrl: './about-taidhgin.component.html',
  styleUrls: ['./about-taidhgin.component.scss']
})
export class AboutTaidhginComponent implements OnInit {

  constructor(public ts : TranslationService) { }

  ngOnInit(): void {
  }

}
