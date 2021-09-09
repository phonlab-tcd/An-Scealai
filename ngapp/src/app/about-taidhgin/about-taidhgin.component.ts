import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../translation.service';

@Component({
  selector: 'app-about-taidhgin',
  templateUrl: './about-taidhgin.component.html',
  styleUrls: ['./about-taidhgin.component.css']
})
export class AboutTaidhginComponent implements OnInit {

  constructor(public ts : TranslationService) { }

  ngOnInit(): void {
  }

}
