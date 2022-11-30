import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../translation.service';

@Component({
  selector: 'app-user-guides',
  templateUrl: './user-guides.component.html',
  styleUrls: ['./user-guides.component.scss']
})
export class UserGuidesComponent implements OnInit {

  constructor(public ts : TranslationService) { }

  ngOnInit(): void {
  }

}
